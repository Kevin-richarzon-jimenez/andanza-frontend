import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthPromptContext } from './AuthPromptContext.js'
import AuthPromptDialog from '../components/AuthPromptDialog.jsx'
import { setAuthRequiredHandler } from '../api/client.js'

// Decide cómo pedir la cuenta: un aviso encima de la página (sin sacar al usuario de lo que estaba
// haciendo) con la opción de ir a iniciar sesión o registrarse, y volver luego a la misma página.
function AuthPromptProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dialogRef = useRef(null)
  const [message, setMessage] = useState('')
  const from = location.pathname + location.search

  const requireLogin = useCallback((text) => {
    setMessage(text)
    if (!dialogRef.current?.open) dialogRef.current?.showModal()
  }, [])

  // Cuando el token vence, las páginas de /account (que no tienen sentido sin sesión) llevan al login;
  // ahí RequireAuth pudo haber redirigido antes de que llegue este aviso, por eso también se cuenta /auth.
  // En el resto de páginas se avisa con el popup, sin sacar al usuario de donde está.
  useEffect(() => {
    setAuthRequiredHandler(() => {
      if (location.pathname.startsWith('/account') || location.pathname.startsWith('/auth')) {
        navigate('/auth/login', { replace: true, state: { expired: true, from: location.state?.from ?? from } })
      } else {
        requireLogin('Tu sesión expiró. Inicia sesión de nuevo para continuar.')
      }
    })
    return () => setAuthRequiredHandler(null)
  }, [location.pathname, location.state, from, navigate, requireLogin])

  function goTo(path) {
    dialogRef.current?.close()
    navigate(path, { state: { from } })
  }

  const value = useMemo(() => ({ requireLogin }), [requireLogin])

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <AuthPromptDialog
        ref={dialogRef}
        message={message}
        onLogin={() => goTo('/auth/login')}
        onRegister={() => goTo('/auth/register')}
        onClose={() => dialogRef.current?.close()}
      />
    </AuthPromptContext.Provider>
  )
}

export default AuthPromptProvider
