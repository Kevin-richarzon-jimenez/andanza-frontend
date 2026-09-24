import { Link } from 'react-router-dom'

// Recuperar la contraseña necesita un endpoint y el envío de correos en el backend, que todavía no existen.
function ForgotPassword() {
  return (
    <>
      <h1>Recupera tu contraseña</h1>
      <p className="subtitle">
        Por ahora no podemos enviar el enlace de recuperación de forma automática. Escríbenos a{' '}
        <a href="mailto:ayuda@andanza.co">ayuda@andanza.co</a> desde el correo de tu cuenta y te ayudamos a recuperarla.
      </p>

      <div className="auth-links">¿Ya la recordaste? <Link to="/auth/login">Inicia sesión</Link></div>
    </>
  )
}

export default ForgotPassword
