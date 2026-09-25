import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { isStaff, roleLabel } from '../auth/roles.js'
import { useLogout } from '../auth/useLogout.js'
import { useCart } from '../cart/useCart.js'
import { LogoutIcon, PanelIcon, UserIcon } from './Icons.jsx'
import UserMenu from './UserMenu.jsx'
import './Header.css'

// En el Inicio el encabezado flota sobre la portada; al bajar unos píxeles gana fondo blanco.
const PIN_SCROLL_OFFSET = 10

function Header() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const requestLogout = useLogout()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const overlay = pathname === '/'
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (!overlay) return

    let ticking = false

    function applyScrollState() {
      setPinned(window.scrollY > PIN_SCROLL_OFFSET)
      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(applyScrollState)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    applyScrollState()
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  function handleSearch(event) {
    event.preventDefault()
    const text = query.trim()
    navigate(text ? `/catalog?search=${encodeURIComponent(text)}` : '/catalog')
  }

  // Con sesión, el avatar abre un menú: el acceso al panel de gestión lo ve solo el personal interno.
  const accountItems = [
    { key: 'profile', label: 'Mi perfil', icon: <UserIcon />, to: '/account/profile' },
    ...(isStaff(user) ? [{ key: 'panel', label: 'Ir al panel de gestión', icon: <PanelIcon />, to: '/admin' }] : []),
    { separator: true },
    { key: 'logout', label: 'Cerrar sesión', icon: <LogoutIcon />, tone: 'danger', onSelect: requestLogout },
  ]

  const headerClassName = overlay
    ? `site-header site-header--overlay${pinned ? ' is-pinned' : ''}`
    : 'site-header'

  return (
    <>
      <header className={headerClassName}>
        <Link to="/" className="site-logo">andanza<span>.</span></Link>
        <nav className="site-nav">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/catalog">Catálogo</NavLink>
          <NavLink to="/info/about">Información</NavLink>
        </nav>
        <form className="site-search" role="search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar zapatos..."
            aria-label="Buscar zapatos"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="site-icons">
          {isAuthenticated ? (
            <UserMenu
              triggerClassName="icon-btn"
              triggerLabel="Menú de mi cuenta"
              triggerContent={<UserIcon />}
              name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
              detail={`${user?.email ?? ''} · ${roleLabel(user)}`}
              items={accountItems}
            />
          ) : (
            <Link to="/auth/login" state={{ from: pathname + search }} className="icon-btn" aria-label="Iniciar sesión">
              <UserIcon />
            </Link>
          )}
          <Link to="/cart" className="icon-btn" aria-label={`Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16l-1.5 11a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L4 7Z" />
              <path d="M8 7V6a4 4 0 0 1 8 0v1" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </header>
    </>
  )
}

export default Header
