import Modal from './Modal.jsx'

// "Cancelar" va primero: showModal() enfoca el primer botón, así que Enter por descuido no confirma.
function ConfirmDialog({ ref, title, message, confirmLabel, onConfirm, onCancel, onClose }) {
  return (
    <Modal ref={ref} title={title} onClose={onClose}>
      <p>{message}</p>
      <div className="modal-actions row">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn-fill" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
