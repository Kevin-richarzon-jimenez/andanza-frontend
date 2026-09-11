import { useState } from 'react'
import '../account-shared.css'

function Profile() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <h1>Mis datos personales</h1>
      <form className="field-grid" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="first-name">Nombre</label>
          <input type="text" id="first-name" defaultValue="Juan" required />
        </div>
        <div className="field-group">
          <label htmlFor="last-name">Apellido</label>
          <input type="text" id="last-name" defaultValue="Pérez" required />
        </div>
        <div className="field-group">
          <label htmlFor="email">Correo</label>
          <input type="email" id="email" defaultValue="juanperez@email.com" required />
        </div>
        <div className="field-group">
          <label htmlFor="phone">Teléfono</label>
          <input type="tel" id="phone" defaultValue="300 123 4567" />
        </div>
        <div className="field-group" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-fill">Guardar cambios</button>
          {saved && <p className="form-feedback">¡Datos guardados!</p>}
        </div>
      </form>
    </>
  )
}

export default Profile
