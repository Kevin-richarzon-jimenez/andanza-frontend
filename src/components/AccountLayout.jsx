import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { isStaff } from '../auth/roles.js'
import { useLogout } from '../auth/useLogout.js'
import { useFavorites } from '../favorites/useFavorites.js'
import { listMyComments } from '../api/comments.js'
import './AccountLayout.css'

function AccountLayout() {
  const { user } = useAuth()
  const requestLogout = useLogout()
  const { favorites } = useFavorites()
  const [commentCount, setCommentCount] = useState(null)

  useEffect(() => {
    let cancelled = false
    listMyComments()
      .then((comments) => { if (!cancelled) setCommentCount(comments.length) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return (
    <main className="account-body">
      <aside className="account-sidebar">
        <div className="account-profile">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </div>
          <div>
            <div className="name">{user?.firstName} {user?.lastName}</div>
            <div className="email">{user?.email}</div>
          </div>
        </div>
        <ul className="account-menu">
          <li><NavLink to="/account/profile">Mis datos personales <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/addresses">Mis direcciones <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/favorites">Mis favoritos <span className="mono">({favorites.length}) ›</span></NavLink></li>
          <li>
            <NavLink to="/account/comments">
              Mis comentarios <span className="mono">{commentCount === null ? '' : `(${commentCount}) `}›</span>
            </NavLink>
          </li>
          <li><NavLink to="/account/orders">Mis pedidos <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/change-password">Cambiar contraseña <span aria-hidden="true">›</span></NavLink></li>
          {isStaff(user) && (
            <li><NavLink to="/admin">Panel de gestión <span aria-hidden="true">›</span></NavLink></li>
          )}
          <li><button type="button" className="logout" onClick={requestLogout}>Cerrar sesión <span aria-hidden="true">›</span></button></li>
        </ul>
      </aside>

      <div className="account-content">
        <Outlet />
      </div>
    </main>
  )
}

export default AccountLayout
