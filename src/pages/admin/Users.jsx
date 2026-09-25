import { useState } from 'react'
import Pagination from '../../components/Pagination.jsx'
import { useAuth } from '../../auth/useAuth.js'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { useListParams } from '../../hooks/useListParams.js'
import { listAdminUsers, updateAdminUser } from '../../api/admin.js'
import PageHeader from '../../components/admin/PageHeader.jsx'
import RowActions from '../../components/admin/RowActions.jsx'
import './admin-shared.css'

const PAGE_SIZE = 10

function Users() {
  const { user: currentUser } = useAuth()
  const confirm = useConfirm()
  const { params, page, update, setPage } = useListParams()
  const search = params.get('search') ?? ''
  const [actionError, setActionError] = useState(null)
  const [notice, setNotice] = useState('')

  const { data, error, reload } = useApiData(() => listAdminUsers({ search, page, size: PAGE_SIZE }), `admin:users:${params}`)

  function handleSearch(event) {
    event.preventDefault()
    update({ search: new FormData(event.target).get('search').trim(), page: '' })
  }

  async function change(user, changes, confirmation) {
    if (confirmation && !(await confirm(confirmation))) return
    setActionError(null)
    setNotice('')
    try {
      await updateAdminUser(user.id, { role: user.role, accountStatus: user.accountStatus, ...changes })
      setNotice(`Se actualizó la cuenta de ${user.firstName} ${user.lastName}.`)
      reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  function toggleRole(user) {
    const promoting = user.role !== 'ADMIN'
    return change(user, { role: promoting ? 'ADMIN' : 'CUSTOMER' }, promoting
      ? {
        title: '¿Convertir en administrador?',
        message: `${user.firstName} ${user.lastName} podrá gestionar productos, categorías, comentarios y usuarios. Verá el panel la próxima vez que inicie sesión.`,
        confirmLabel: 'Convertir en administrador',
      }
      : {
        title: '¿Quitar el rol de administrador?',
        message: `${user.firstName} ${user.lastName} volverá a ser cliente y perderá el acceso al panel.`,
        confirmLabel: 'Quitar el rol',
      })
  }

  function toggleBlocked(user) {
    const blocking = user.accountStatus !== 'BLOCKED'
    return change(user, { accountStatus: blocking ? 'BLOCKED' : 'ACTIVE' }, blocking
      ? {
        title: '¿Bloquear esta cuenta?',
        message: `${user.firstName} ${user.lastName} no podrá iniciar sesión ni usar su cuenta hasta que la desbloquees.`,
        confirmLabel: 'Bloquear',
      }
      : null)
  }

  return (
    <>
      <PageHeader title="Usuarios" />

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={handleSearch}>
          <input key={search} name="search" defaultValue={search} placeholder="Buscar por nombre o correo" aria-label="Buscar usuarios" />
          <button type="submit" className="btn btn-outline btn-small">Buscar</button>
        </form>
        {search && (
          <button type="button" className="clear-filters" style={{ width: 'auto', margin: 0 }} onClick={() => update({ search: '', page: '' })}>
            Limpiar búsqueda
          </button>
        )}
      </div>

      {actionError && <p className="form-error" role="alert" style={{ marginTop: 0, marginBottom: 12 }}>{actionError}</p>}
      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !data && <div className="admin-empty">Cargando usuarios...</div>}
      {!error && data && data.content.length === 0 && <div className="admin-empty">No hay usuarios con esa búsqueda.</div>}

      {!error && data && data.content.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Usuario</th><th>Rol</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {data.content.map((user) => {
                const isMe = user.id === currentUser?.id
                return (
                  <tr key={user.id}>
                    <td>
                      <span className="strong">{user.firstName} {user.lastName}</span>
                      <span className="muted">{user.email}</span>
                    </td>
                    <td><span className={user.role === 'ADMIN' ? 'status-badge on' : 'status-badge off'}>{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</span></td>
                    <td><span className={user.accountStatus === 'BLOCKED' ? 'status-badge danger' : 'status-badge on'}>{user.accountStatus === 'BLOCKED' ? 'Bloqueada' : 'Activa'}</span></td>
                    <td>
                      {isMe ? (
                        <span className="muted" style={{ textAlign: 'right' }}>Tu cuenta</span>
                      ) : (
                        <RowActions actions={[
                          { key: 'role', label: user.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin', onClick: () => toggleRole(user) },
                          { key: 'blocked', label: user.accountStatus === 'BLOCKED' ? 'Desbloquear' : 'Bloquear', variant: user.accountStatus === 'BLOCKED' ? 'secondary' : 'danger', onClick: () => toggleBlocked(user) },
                        ]} />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </>
  )
}

export default Users
