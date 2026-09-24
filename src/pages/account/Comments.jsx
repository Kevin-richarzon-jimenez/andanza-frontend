import { useState } from 'react'
import EmptyState from '../../components/EmptyState.jsx'
import '../account-shared.css'

const initialComments = [
  {
    id: 1,
    product: 'Tenis Revolution Negro',
    rating: 5,
    text: 'Muy cómodos para uso diario, la talla es exacta a la de siempre.',
    date: '12 ago 2026',
  },
  {
    id: 2,
    product: 'Bota 6-Inch Trigo',
    rating: 5,
    text: 'Excelente calidad, aguantó bien la lluvia en un viaje reciente.',
    date: '3 jul 2026',
  },
]

function CommentRow({ comment, onDelete, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.text)
  const [removing, setRemoving] = useState(false)

  function handleDelete() {
    setRemoving(true)
    setTimeout(() => onDelete(comment.id), 200)
  }

  function handleSave() {
    onSave(comment.id, draft.trim() || comment.text)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(comment.text)
    setEditing(false)
  }

  return (
    <div className="comment-row" style={{ opacity: removing ? 0 : 1 }}>
      <div className="comment-top">
        <span className="comment-author">{comment.product}</span>
        <span className="comment-stars" aria-label={`${comment.rating} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} className="star-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
            </svg>
          ))}
        </span>
      </div>

      {editing ? (
        <textarea
          className="comment-edit-textarea"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoFocus
        />
      ) : (
        <p className="comment-text">{comment.text}</p>
      )}

      <div className="comment-top" style={{ marginTop: '8px' }}>
        <span className="comment-date">{comment.date}</span>
        {editing ? (
          <div className="comment-actions">
            <button type="button" className="btn btn-fill btn-small" onClick={handleSave}>Guardar</button>
            <button type="button" className="btn btn-outline btn-small" onClick={handleCancel}>Cancelar</button>
          </div>
        ) : (
          <div className="comment-actions">
            <button type="button" className="icon-action" aria-label="Editar comentario" onClick={() => setEditing(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .622.622l4.353-1.32a2 2 0 0 0 .83-.497Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button type="button" className="icon-action" aria-label="Eliminar comentario" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Comments() {
  const [comments, setComments] = useState(initialComments)

  function handleDelete(id) {
    setComments((current) => current.filter((comment) => comment.id !== id))
  }

  function handleSave(id, newText) {
    setComments((current) =>
      current.map((comment) => (comment.id === id ? { ...comment, text: newText } : comment))
    )
  }

  return (
    <>
      <h1>Mis comentarios</h1>

      {comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} onDelete={handleDelete} onSave={handleSave} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
          title="Todavía no has dejado comentarios"
          text="Cuando compres algo, cuéntanos qué te pareció."
          ctaText="Explorar catálogo"
          ctaHref="/catalog"
        />
      )}
    </>
  )
}

export default Comments
