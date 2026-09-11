import { NavLink, Outlet } from 'react-router-dom'
import './AccountLayout.css'

function AccountLayout() {
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
            <div className="name">Juan Pérez</div>
            <div className="email">juanperez@email.com</div>
          </div>
        </div>
        <ul className="account-menu">
          <li><NavLink to="/account/profile">Mis datos personales <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/addresses">Mis direcciones <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/favorites">Mis favoritos <span className="mono">(3) ›</span></NavLink></li>
          <li><NavLink to="/account/comments">Mis comentarios <span className="mono">(2) ›</span></NavLink></li>
          <li><NavLink to="/account/orders">Mis pedidos <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/account/change-password">Cambiar contraseña <span aria-hidden="true">›</span></NavLink></li>
          <li><NavLink to="/auth/login" className="logout">Cerrar sesión <span aria-hidden="true">›</span></NavLink></li>
        </ul>
      </aside>

      <div className="account-content">
        <Outlet />
      </div>
    </main>
  )
}

export default AccountLayout
