import { Navigate, useLocation } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import { useAuth } from './useAuth.js'

// Envuelve las rutas de /admin. Aquí solo se decide qué mostrar: la seguridad real está en el backend, que
// rechaza con 403 cualquier petición de administración de alguien que no lo sea.
function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (user?.role !== 'ADMIN') {
    return (
      <EmptyState
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        )}
        title="No tienes acceso a esta sección"
        text="El panel de administración es solo para cuentas de administrador."
        ctaText="Volver a la tienda"
        ctaHref="/"
      />
    )
  }
  return children
}

export default RequireAdmin
