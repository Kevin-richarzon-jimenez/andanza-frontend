import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { listMyComments } from '../../api/comments.js'
import { formatDate } from '../../utils/formatDate.js'
import '../account-shared.css'

const STATUS = {
  PUBLISHED: { label: 'Publicado', className: 'on' },
  HIDDEN: { label: 'Oculto por el equipo', className: 'off' },
}

function CommentRow({ comment }) {
  const status = STATUS[comment.status]
  return (
    <div className="comment-row">
      <div className="comment-top">
        <span className="comment-author"><Link to={`/products/${comment.productId}`}>{comment.productName}</Link></span>
        <span className="comment-stars" aria-label={`${comment.rating} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} className={i < comment.rating ? 'star-icon' : 'star-icon empty'} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
            </svg>
          ))}
        </span>
      </div>
      <p className="comment-text">{comment.text}</p>
      <div className="comment-top" style={{ marginTop: '8px' }}>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
        {status && <span className={`status-badge ${status.className}`}>{status.label}</span>}
      </div>
    </div>
  )
}

function Comments() {
  const { data: comments, error, reload } = useApiData(listMyComments, 'my-comments')

  return (
    <>
      <h1>Mis comentarios</h1>

      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !comments && <div className="page-status">Cargando comentarios...</div>}

      {comments && comments.length > 0 && (
        <div>
          {comments.map((comment) => <CommentRow key={comment.id} comment={comment} />)}
        </div>
      )}

      {comments && comments.length === 0 && (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
          title="Todavía no has dejado comentarios"
          text="Entra a un producto y cuéntanos qué te pareció."
          ctaText="Explorar catálogo"
          ctaHref="/catalog"
        />
      )}
    </>
  )
}

export default Comments
