import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { clearSession, onSessionChange, readSession, saveSession } from './session.js'
import * as authApi from '../api/auth.js'
import { queryClient } from '../api/queryClient.js'

function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  // El cliente de la API descarta la sesión cuando el token vence: aquí se refleja en el estado.
  // Al cambiar de sesión se vacía la caché de consultas, para que nadie vea datos de la cuenta anterior.
  useEffect(() => onSessionChange(() => {
    setSession(readSession())
    queryClient.resetQueries()
  }), [])

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials)
    saveSession({ token: data.token, user: data.user })
    return data.user
  }, [])

  const register = useCallback(async (details) => {
    const data = await authApi.register(details)
    saveSession({ token: data.token, user: data.user })
    return data.user
  }, [])

  const logout = useCallback(() => clearSession(), [])

  const value = useMemo(
    () => ({ user: session?.user ?? null, isAuthenticated: Boolean(session?.token), login, register, logout }),
    [session, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
