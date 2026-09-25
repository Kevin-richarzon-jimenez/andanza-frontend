import { clearSession, getToken } from '../auth/session.js'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '')

// El servidor gratuito se duerme sin tráfico y tarda en despertar: mientras tanto no responde o
// contesta 502/503/504. Un límite de tiempo evita esperar sin fin una petición que nunca llega.
const REQUEST_TIMEOUT_MS = 20000
const UNAVAILABLE_STATUSES = [502, 503, 504]
const UNAVAILABLE_MESSAGE = 'El servidor no está disponible en este momento. Puede estar despertando: inténtalo de nuevo en unos segundos.'
const OFFLINE_MESSAGE = 'Sin conexión a internet. Revisa tu red e inténtalo de nuevo.'

// Error de la API con la forma del backend: { status, message, errors: [{ field, message }] }.
export class ApiError extends Error {
  constructor(status, body) {
    const fallback = UNAVAILABLE_STATUSES.includes(status) ? UNAVAILABLE_MESSAGE : 'No pudimos completar la solicitud. Inténtalo de nuevo.'
    super(body?.message || fallback)
    this.name = 'ApiError'
    this.status = status
    this.errors = Array.isArray(body?.errors) ? body.errors : []
  }

  fieldMessage(field) {
    return this.errors.find((error) => error.field === field)?.message
  }
}

// Sin respuesta del servidor (status 0) o respondiendo 502/503/504: vale la pena volver a intentar.
export function isServerUnavailable(error) {
  return error instanceof ApiError && (error.status === 0 || UNAVAILABLE_STATUSES.includes(error.status))
}

// Despierta al servidor mientras el usuario todavía lee la página; la respuesta no se usa.
export function warmUpServer() {
  const healthUrl = new URL('/actuator/health', new URL(API_URL, window.location.origin))
  fetch(healthUrl, { mode: 'no-cors', cache: 'no-store' }).catch(() => {})
}

async function fetchWithTimeout(url, init, signal) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) abort()
  signal?.addEventListener('abort', abort)
  const timer = setTimeout(abort, REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
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
// sesión vencida sin sacarlo de la página en la que está. `signal` permite cancelar la petición.
export async function request(path, { method = 'GET', body, query, redirectOnExpired = true, signal } = {}, isRetry = false) {
  const token = getToken()
  const headers = {}
  // Un FormData (subida de archivos) lo arma el navegador con su propio Content-Type y sus separadores.
  const isFormData = body instanceof FormData
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetchWithTimeout(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    }, signal)
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(0, { message: navigator.onLine === false ? OFFLINE_MESSAGE : UNAVAILABLE_MESSAGE })
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    // Un token vencido o inválido hace que el backend responda 401 incluso en rutas públicas. Se descarta
    // la sesión y se reintenta una vez sin token: las rutas públicas funcionan, y en las protegidas el
    // segundo 401 significa que hay que volver a iniciar sesión.
    if (response.status === 401 && token && !isRetry) {
      clearSession()
      try {
        return await request(path, { method, body, query, redirectOnExpired, signal }, true)
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
