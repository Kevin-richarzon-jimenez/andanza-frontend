import { Link, Outlet } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout() {
  return (
    <main className="auth-split">
      <div className="auth-form">
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
