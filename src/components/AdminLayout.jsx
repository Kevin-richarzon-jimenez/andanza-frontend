import { Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { initialsOf, roleLabel } from '../auth/roles.js'
import { useLogout } from '../auth/useLogout.js'
import { BoxIcon, ChatIcon, ChevronDownIcon, HomeIcon, LogoutIcon, MailIcon, StoreIcon, TagIcon, UserIcon, UsersIcon } from './Icons.jsx'
import ServerStatusBanner from './ServerStatusBanner.jsx'
import UserMenu from './UserMenu.jsx'
import './AdminLayout.css'

const NAV = [
  { items: [{ to: '/admin', label: 'Resumen', icon: <HomeIcon />, end: true }] },
  {
    title: 'Catálogo',
    items: [
      { to: '/admin/products', label: 'Productos', icon: <BoxIcon /> },
      { to: '/admin/categories', label: 'Categorías', icon: <TagIcon /> },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      { to: '/admin/comments', label: 'Comentarios', icon: <ChatIcon /> },
      { to: '/admin/messages', label: 'Mensajes', icon: <MailIcon /> },
    ],
  },
  { title: 'Sistema', items: [{ to: '/admin/users', label: 'Usuarios', icon: <UsersIcon /> }] },
]
const ITEMS = NAV.flatMap((group) => group.items)

// El panel de gestión es otro sitio: no comparte el encabezado, el pie ni los menús de la tienda. Es para el
// personal interno (hoy, administradores).
function AdminLayout() {
  const { user } = useAuth()
  const requestLogout = useLogout()
  const { pathname } = useLocation()

  const current = ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
  const isProfile = pathname.startsWith('/admin/profile')
  const section = isProfile ? 'Mi perfil' : current?.label

  const menuItems = [
    { key: 'profile', label: 'Mi perfil', icon: <UserIcon />, to: '/admin/profile' },
    { key: 'store', label: 'Ir a la tienda', icon: <StoreIcon />, to: '/' },
    { separator: true },
    { key: 'logout', label: 'Cerrar sesión', icon: <LogoutIcon />, tone: 'danger', onSelect: requestLogout },
  ]
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  return (
    <div className="panel">
      <aside className="panel-sidebar">
        <Link to="/admin" className="panel-brand" aria-label="Andanza Gestión, ir al resumen">
          andanza<span>.</span>
          <em>Gestión</em>
        </Link>
        <nav className="panel-nav" aria-label="Menú de gestión">
          {NAV.map((group, index) => (
            <div className="panel-nav-group" key={group.title ?? index}>
              {group.title && <div className="panel-nav-title">{group.title}</div>}
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className="panel-nav-item">
                  <span className="panel-nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="panel-main">
        <header className="panel-topbar">
          <div className="panel-crumbs">
            <span>Gestión</span>
            {section && (
              <>
                <span aria-hidden="true">/</span>
                <strong>{section}</strong>
              </>
            )}
          </div>
          <UserMenu
            triggerClassName="panel-user"
            triggerLabel="Menú de mi cuenta"
            triggerContent={(
              <>
                <span className="panel-avatar">{initialsOf(user)}</span>
                <span className="panel-user-text">
                  <span className="panel-user-name">{fullName}</span>
                  <span className="panel-user-role">{roleLabel(user)}</span>
                </span>
                <span className="panel-user-chevron"><ChevronDownIcon /></span>
              </>
            )}
            name={fullName}
            detail={user?.email}
            items={menuItems}
          />
        </header>

        <main className="panel-content">
          <Suspense fallback={<p className="page-status">Cargando...</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <ServerStatusBanner />
    </div>
  )
}

export default AdminLayout
