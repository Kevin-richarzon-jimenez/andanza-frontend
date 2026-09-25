import { useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination.jsx'
import Select from '../../components/Select.jsx'
import Stars from '../../components/Stars.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useListParams } from '../../hooks/useListParams.js'
import { listAdminComments, setCommentVisibility } from '../../api/admin.js'
import { formatDate } from '../../utils/formatDate.js'
import PageHeader from '../../components/admin/PageHeader.jsx'
import RowActions from '../../components/admin/RowActions.jsx'
import './admin-shared.css'

const PAGE_SIZE = 10
const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PUBLISHED', label: 'Publicados' },
  { value: 'HIDDEN', label: 'Ocultos' },
]

function AdminComments() {
  const { params, page, update, setPage } = useListParams()
  const status = params.get('status') ?? ''
  const [actionError, setActionError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const { data, error, reload } = useApiData(
    () => listAdminComments({ status, page, size: PAGE_SIZE }),
    `admin:comments:${params}`,
  )

  async function toggle(comment) {
    setBusyId(comment.id)
    setActionError(null)
    try {
      await setCommentVisibility(comment.id, comment.status !== 'PUBLISHED')
      reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader title="Comentarios" />
      <p className="admin-subtitle">Los comentarios se publican al instante. Aquí puedes ocultar los que no correspondan y volver a mostrarlos.</p>

      <div className="admin-toolbar">
        <Select
          ariaLabel="Estado"
          prefix="Estado:"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(value) => update({ status: value, page: '' })}
        />
      </div>

      {actionError && <p className="form-error" role="alert" style={{ marginTop: 0, marginBottom: 12 }}>{actionError}</p>}
      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !data && <div className="admin-empty">Cargando comentarios...</div>}
      {!error && data && data.content.length === 0 && <div className="admin-empty">No hay comentarios con ese filtro.</div>}

      {!error && data && data.content.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Comentario</th>
                <th>Estado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((comment) => {
                const published = comment.status === 'PUBLISHED'
                return (
                  <tr key={comment.id}>
                    <td>
                      <Link className="strong" to={`/products/${comment.productId}`}>{comment.productName}</Link>
                      <span className="muted">{comment.authorName} · {formatDate(comment.createdAt)}</span>
                    </td>
                    <td className="text-cell">
                      <Stars rating={comment.rating} />
                      <div>{comment.text}</div>
                    </td>
                    <td><span className={published ? 'status-badge on' : 'status-badge off'}>{published ? 'Publicado' : 'Oculto'}</span></td>
                    <td>
                      <RowActions actions={[{ label: published ? 'Ocultar' : 'Mostrar', disabled: busyId === comment.id, onClick: () => toggle(comment) }]} />
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

export default AdminComments
