import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSent(true)
    form.reset()
  }

  return (
    <>
      <h1>Recupera tu contraseña</h1>
      <p className="subtitle">Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" name="email" autoComplete="email" required />
        </div>
        <button type="submit" className="btn btn-fill">Enviar enlace</button>
        {sent && (
          <p className="form-feedback">Si el correo existe, te enviaremos un enlace para recuperar tu contraseña.</p>
        )}
      </form>

      <div className="auth-links">¿Ya la recordaste? <Link to="/auth/login">Inicia sesión</Link></div>
    </>
  )
}

export default ForgotPassword
