import { useAuth } from '../../auth/useAuth.js'
import '../account-shared.css'

// Editar los datos personales necesita endpoints de perfil en el backend, que todavía no existen:
// por ahora se muestran los datos de la cuenta, sin poder cambiarlos.
function Profile() {
  const { user } = useAuth()

  return (
    <>
      <h1>Mis datos personales</h1>
      <div className="field-grid">
        <div className="field-group">
          <label htmlFor="first-name">Nombre</label>
          <input type="text" id="first-name" value={user?.firstName ?? ''} readOnly />
        </div>
        <div className="field-group">
          <label htmlFor="last-name">Apellido</label>
          <input type="text" id="last-name" value={user?.lastName ?? ''} readOnly />
        </div>
        <div className="field-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="email">Correo</label>
          <input type="email" id="email" value={user?.email ?? ''} readOnly />
        </div>
        <p className="form-notice" style={{ gridColumn: '1 / -1' }}>
          Editar tus datos estará disponible pronto. Mientras tanto, si necesitas corregir algo escríbenos a{' '}
          <a href="mailto:ayuda@andanza.co">ayuda@andanza.co</a>.
        </p>
      </div>
    </>
  )
}

export default Profile
