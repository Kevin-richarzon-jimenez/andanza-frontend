import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { formatTitle } from '../hooks/useDocumentTitle.js'

const TITLES = {
  '/catalog': 'Catálogo',
  '/cart': 'Mi carrito',
  '/auth/login': 'Iniciar sesión',
  '/auth/register': 'Crear cuenta',
  '/auth/forgot-password': 'Recuperar contraseña',
  '/account/profile': 'Mis datos personales',
  '/account/addresses': 'Mis direcciones',
  '/account/addresses/new': 'Nueva dirección',
  '/account/favorites': 'Mis favoritos',
  '/account/comments': 'Mis comentarios',
  '/account/orders': 'Mis pedidos',
  '/account/change-password': 'Cambiar contraseña',
  '/info/about': 'Sobre nosotros',
  '/info/contact': 'Contacto',
  '/info/faq': 'Preguntas frecuentes',
  '/info/returns': 'Cambios y devoluciones',
  '/info/shipping': 'Envíos',
  '/info/size-guide': 'Guía de tallas',
  '/info/terms': 'Términos y privacidad',
}

function titleFor(pathname) {
  if (pathname.startsWith('/admin')) return 'Gestión'
  if (pathname.startsWith('/account/addresses/')) return 'Editar dirección'
  return TITLES[pathname]
}

// Título de la pestaña según la ruta. La ficha de producto pone el suyo (el nombre del producto).
function RouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname.startsWith('/products/')) document.title = formatTitle(titleFor(pathname))
  }, [pathname])

  return null
}

export default RouteTitle
