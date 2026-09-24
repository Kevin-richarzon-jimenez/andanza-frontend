import { Link, Outlet, useLocation } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout() {
  const from = useLocation().state?.from
  // Las páginas de /account piden sesión: volver a ellas rebotaría otra vez al login.
  const backTo = from && !from.startsWith('/account') ? from : '/'

  return (
    <main className="auth-split">
      <div className="auth-form">
        <Link to={backTo} className="back-link auth-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Volver a la tienda
        </Link>
        <Link to="/" className="site-logo">andanza<span>.</span></Link>
        <Outlet />
      </div>
      <div className="auth-visual">
        <div className="placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.4" />
            <path d="M21 15l-5-5-4 4-3-3-6 6" />
          </svg>
          <span>[imagen]</span>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
