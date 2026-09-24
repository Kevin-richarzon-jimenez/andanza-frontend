import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth.js'
import { describeError } from '../../utils/formErrors.js'

const PASSWORD_RULE = 'Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número'

function isStrong(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'
  const { register } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target

    passwordRef.current?.setCustomValidity(isStrong(password) ? '' : PASSWORD_RULE)
    confirmPasswordRef.current?.setCustomValidity(password === confirmPassword ? '' : 'Las contraseñas no coinciden')

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const data = new FormData(form)
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      await register({
        firstName: data.get('first-name'),
        lastName: data.get('last-name'),
        email: data.get('email'),
        password,
        confirmPassword,
      })
      navigate(from, { replace: true })
    } catch (err) {
      const { message, fields } = describeError(err)
      setError(message)
      setFieldErrors(fields)
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1>Crea tu cuenta</h1>
      <p className="subtitle">Guarda tus tallas, tus direcciones y sigue tus pedidos.</p>

      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field-group">
            <label htmlFor="first-name">Nombre</label>
            <input type="text" id="first-name" name="first-name" autoComplete="given-name" required minLength={2} maxLength={40} />
            <FieldError message={fieldErrors.firstName} />
          </div>
          <div className="field-group">
            <label htmlFor="last-name">Apellido</label>
            <input type="text" id="last-name" name="last-name" autoComplete="family-name" required minLength={2} maxLength={40} />
            <FieldError message={fieldErrors.lastName} />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" name="email" autoComplete="email" required />
          <FieldError message={fieldErrors.email} />
        </div>
        <div className="field-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            maxLength={72}
            ref={passwordRef}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              passwordRef.current?.setCustomValidity('')
            }}
          />
          <FieldError message={fieldErrors.password} />
        </div>
        <div className="field-group">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            required
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              confirmPasswordRef.current?.setCustomValidity('')
            }}
          />
          <FieldError message={fieldErrors.confirmPassword} />
        </div>
        <label className="auth-check">
          <input type="checkbox" required />
          Acepto los términos y condiciones
        </label>
        <button type="submit" className="btn btn-fill" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>

      <div className="auth-links">¿Ya tienes cuenta? <Link to="/auth/login" state={{ from }}>Inicia sesión</Link></div>
    </>
  )
}

export default Register
