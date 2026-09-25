import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import './AccountLayout.css'

const MENU = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/categories', label: 'Categorías' },
  { to: '/admin/comments', label: 'Comentarios' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/messages', label: 'Mensajes' },
]

// Comparte el aspecto del menú de "Mi cuenta" (AccountLayout.css) con su propio contenido.
function AdminLayout() {
  const { user } = useAuth()

  return (
    <main className="account-body">
      <aside className="account-sidebar">
        <div className="account-profile">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="name">Administración</div>
            <div className="email">{user?.email}</div>
          </div>
        </div>
        <ul className="account-menu">
          {MENU.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end}>{item.label} <span aria-hidden="true">›</span></NavLink>
            </li>
          ))}
          <li><Link to="/">Volver a la tienda <span aria-hidden="true">›</span></Link></li>
        </ul>
      </aside>

      <div className="account-content">
        <Suspense fallback={<p className="page-status">Cargando...</p>}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  )
}

export default AdminLayout
