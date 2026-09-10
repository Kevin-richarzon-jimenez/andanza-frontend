import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const confirmPasswordRef = useRef(null)

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value)
    confirmPasswordRef.current?.setCustomValidity('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.target

    if (password !== confirmPassword) {
      confirmPasswordRef.current?.setCustomValidity('Las contraseñas no coinciden')
    } else {
      confirmPasswordRef.current?.setCustomValidity('')
    }

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setSubmitting(true)
    navigate('/')
  }

  return (
    <>
      <h1>Crea tu cuenta</h1>
      <p className="subtitle">Guarda tus tallas, tus direcciones y sigue tus pedidos.</p>

      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field-group">
            <label htmlFor="first-name">Nombre</label>
            <input type="text" id="first-name" name="first-name" autoComplete="given-name" required />
          </div>
          <div className="field-group">
            <label htmlFor="last-name">Apellido</label>
            <input type="text" id="last-name" name="last-name" autoComplete="family-name" required />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" name="email" autoComplete="email" required />
        </div>
        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            required
            minLength={8}
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <label className="auth-check">
          <input type="checkbox" required />
          Acepto los términos y condiciones
        </label>
        <button type="submit" className="btn btn-fill" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="auth-links">¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link></div>
    </>
  )
}

export default Register
