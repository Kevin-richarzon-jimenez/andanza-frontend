import { clearSession, getToken } from '../auth/session.js'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '')

// Error de la API con la forma del backend: { status, message, errors: [{ field, message }] }.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || 'No pudimos completar la solicitud. Inténtalo de nuevo.')
    this.name = 'ApiError'
    this.status = status
    this.errors = Array.isArray(body?.errors) ? body.errors : []
  }

  fieldMessage(field) {
    return this.errors.find((error) => error.field === field)?.message
  }
}

let authRequiredHandler = null

// Lo llama la app para llevar al usuario al login cuando una ruta protegida responde 401.
export function setAuthRequiredHandler(handler) {
  authRequiredHandler = handler
}

function buildUrl(path, query) {
  const url = new URL(API_URL + path, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    for (const item of [].concat(value ?? [])) {
      if (item !== '' && item !== null && item !== undefined) url.searchParams.append(key, item)
    }
  }
  return url
}

// `redirectOnExpired: false` es para cargas en segundo plano (no una acción del usuario): descartan la
// sesión vencida sin sacarlo de la página en la que está.
export async function request(path, { method = 'GET', body, query, redirectOnExpired = true } = {}, isRetry = false) {
  const token = getToken()
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, { message: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.' })
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    // Un token vencido o inválido hace que el backend responda 401 incluso en rutas públicas. Se descarta
    // la sesión y se reintenta una vez sin token: las rutas públicas funcionan, y en las protegidas el
    // segundo 401 significa que hay que volver a iniciar sesión.
    if (response.status === 401 && token && !isRetry) {
      clearSession()
      try {
        return await request(path, { method, body, query, redirectOnExpired }, true)
      } catch (error) {
        // En login y registro un 401 significa credenciales incorrectas, no sesión vencida.
        const isCredentialsRequest = path === '/auth/login' || path === '/auth/register'
        if (error.status === 401 && !isCredentialsRequest && redirectOnExpired) authRequiredHandler?.()
        throw error
      }
    }
    throw new ApiError(response.status, data)
  }
  return data
}
