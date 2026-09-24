import Modal from './Modal.jsx'

function AuthPromptDialog({ ref, message, onLogin, onRegister, onClose }) {
  return (
    <Modal ref={ref} title="Necesitas una cuenta">
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-fill" onClick={onLogin}>Iniciar sesión</button>
        <button type="button" className="btn btn-outline" onClick={onRegister}>Crear cuenta</button>
      </div>
      <button type="button" className="modal-dismiss" onClick={onClose}>Ahora no</button>
    </Modal>
  )
}

export default AuthPromptDialog
