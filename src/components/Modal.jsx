import { useId } from 'react'
import './Modal.css'

// <dialog> nativo abierto con showModal(): el navegador cierra con Esc, atrapa el foco y bloquea el fondo.
function Modal({ ref, title, onClose, children }) {
  const titleId = useId()

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  return (
    <dialog ref={ref} className="modal" aria-labelledby={titleId} onClose={onClose} onClick={handleBackdropClick}>
      <div className="modal-content">
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
