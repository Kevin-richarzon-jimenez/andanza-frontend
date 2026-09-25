import { Navigate, useLocation } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import { useAuth } from './useAuth.js'
import { isStaff } from './roles.js'

// Envuelve las rutas del panel de gestión (/admin). Aquí solo se decide qué mostrar: la seguridad real está en el
// backend, que rechaza con 403 cualquier petición de gestión de quien no sea personal interno.
function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (!isStaff(user)) {
    // El panel no tiene el encabezado de la tienda: esta pantalla se sostiene sola.
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          )}
          title="No tienes acceso a esta sección"
          text="El panel de gestión es solo para el personal de Andanza."
          ctaText="Ir a la tienda"
          ctaHref="/"
        />
      </main>
    )
  }
  return children
}

export default RequireAdmin
