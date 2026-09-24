import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth.js'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const from = location.state?.from ?? '/'
  const expired = location.state?.expired

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const data = new FormData(form)
    setSubmitting(true)
    setError(null)
    try {
      await login({ email: data.get('email'), password: data.get('password') })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1>Bienvenido de nuevo</h1>
      <p className="subtitle">Inicia sesión para ver tus favoritos, tus pedidos y tus direcciones guardadas.</p>

      {expired && <p className="form-notice" role="status">Tu sesión expiró. Inicia sesión de nuevo para continuar.</p>}

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" name="email" autoComplete="email" required />
        </div>
        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" autoComplete="current-password" required />
        </div>
        <div className="auth-links"><Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link></div>
        <button type="submit" className="btn btn-fill" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>

      <div className="auth-links">¿No tienes cuenta? <Link to="/auth/register" state={{ from }}>Regístrate</Link></div>
    </>
  )
}

export default Login
