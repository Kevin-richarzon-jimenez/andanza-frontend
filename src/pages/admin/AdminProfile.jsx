import { useAuth } from '../../auth/useAuth.js'
import { initialsOf, roleLabel } from '../../auth/roles.js'
import ChangePassword from '../account/ChangePassword.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import './admin-shared.css'
import './AdminProfile.css'

// Perfil de quien trabaja en el panel: sus datos y el cambio de contraseña, sin salir de Gestión.
function AdminProfile() {
  const { user } = useAuth()

  return (
    <>
      <PageHeader title="Mi perfil" />

      <section className="panel-card profile-summary" aria-label="Mis datos">
        <span className="profile-avatar" aria-hidden="true">{initialsOf(user)}</span>
        <dl>
          <div><dt>Nombre</dt><dd>{user?.firstName} {user?.lastName}</dd></div>
          <div><dt>Correo</dt><dd>{user?.email}</dd></div>
          <div><dt>Rol</dt><dd>{roleLabel(user)}</dd></div>
        </dl>
      </section>

      <h2 className="admin-section-title">Cambiar contraseña</h2>
      <div className="panel-card">
        <ChangePassword showTitle={false} />
      </div>
    </>
  )
}

export default AdminProfile
