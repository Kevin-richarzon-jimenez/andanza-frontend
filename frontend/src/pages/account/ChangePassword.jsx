import { useState, useRef } from 'react'
import '../account-shared.css'

function ChangePassword() {
  const [saved, setSaved] = useState(false)
  const formRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
    formRef.current?.reset()
  }

  return (
    <>
      <h1>Cambiar contraseña</h1>
      <form className="narrow-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="current-password">Contraseña actual</label>
          <input type="password" id="current-password" autoComplete="current-password" required />
        </div>
        <div className="field-group">
          <label htmlFor="new-password">Nueva contraseña</label>
          <input type="password" id="new-password" autoComplete="new-password" required minLength={8} />
        </div>
        <div className="field-group">
          <label htmlFor="confirm-new-password">Confirmar nueva contraseña</label>
          <input type="password" id="confirm-new-password" autoComplete="new-password" required minLength={8} />
        </div>
        <button type="submit" className="btn btn-fill" style={{ width: '100%', marginTop: '6px' }}>Guardar cambios</button>
        {saved && <p className="form-feedback">¡Contraseña actualizada!</p>}
      </form>
    </>
  )
}

export default ChangePassword
