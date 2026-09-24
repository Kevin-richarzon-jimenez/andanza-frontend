import Pagination from '../../components/Pagination.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useListParams } from '../../hooks/useListParams.js'
import { listAdminMessages } from '../../api/admin.js'
import { formatDate } from '../../utils/formatDate.js'
import './admin-shared.css'

const PAGE_SIZE = 10

function Messages() {
  const { params, page, setPage } = useListParams()
  const { data, error, reload } = useApiData(() => listAdminMessages({ page, size: PAGE_SIZE }), `admin:messages:${params}`)

  return (
    <>
      <div className="admin-header"><h1>Mensajes de contacto</h1></div>
      <p className="admin-subtitle">Lo que las personas escriben desde la página de contacto, del más reciente al más antiguo.</p>

      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !data && <div className="admin-empty">Cargando mensajes...</div>}
      {!error && data && data.content.length === 0 && <div className="admin-empty">Todavía no hay mensajes.</div>}

      {!error && data && data.content.length > 0 && (
        <div className="message-list">
          {data.content.map((message) => (
            <article className="message-card" key={message.id}>
              <div className="message-card-top">
                <h2>{message.subject}</h2>
                <span className="message-meta">{formatDate(message.createdAt)}</span>
              </div>
              <div className="message-meta">{message.name} · {message.email}</div>
              <p className="message-text">{message.message}</p>
              <a
                className="btn btn-outline btn-small"
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
              >
                Responder por correo
              </a>
            </article>
          ))}
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </>
  )
}

export default Messages
