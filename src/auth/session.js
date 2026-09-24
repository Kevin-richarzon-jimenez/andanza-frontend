// La sesión (token + datos del usuario) vive en sessionStorage: sobrevive a recargar la página, pero
// se borra al cerrar la pestaña. Si el navegador no deja usar el almacenamiento, se mantiene en memoria.
const STORAGE_KEY = 'andanza.session'

let current
const listeners = new Set()

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function readSession() {
  if (current === undefined) current = load()
  return current
}

export function getToken() {
  return readSession()?.token ?? null
}

export function saveSession(session) {
  current = session
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Sin almacenamiento disponible: la sesión queda solo en memoria.
  }
  notify()
}

export function clearSession() {
  current = null
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nada que borrar.
  }
  notify()
}

export function onSessionChange(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
