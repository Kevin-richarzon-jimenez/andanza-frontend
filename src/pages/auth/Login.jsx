import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitting(true)
    navigate('/')
  }

  return (
    <>
      <h1>Bienvenido de nuevo</h1>
      <p className="subtitle">Inicia sesión para ver tus favoritos, tus pedidos y tus direcciones guardadas.</p>

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
      </form>

      <div className="auth-divider"><div className="line"></div>o<div className="line"></div></div>
      <button type="button" className="btn btn-outline" style={{ width: '100%' }}>Continuar con Google</button>
      <div className="auth-links">¿No tienes cuenta? <Link to="/auth/register">Regístrate</Link></div>
    </>
  )
}

export default Login
