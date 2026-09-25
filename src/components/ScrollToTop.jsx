import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// React Router no reinicia el scroll al cambiar de página: sin esto, la página nueva abre a mitad. Con
// "atrás" y "adelante" no se toca: el navegador devuelve al usuario a donde estaba.
function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}

export default ScrollToTop
