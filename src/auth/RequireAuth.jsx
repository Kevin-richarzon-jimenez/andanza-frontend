import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.js'

// Envuelve las rutas que necesitan sesión: sin ella, lleva al login y vuelve a la página pedida al entrar.
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children
}

export default RequireAuth
