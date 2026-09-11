import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../account-shared.css'

function AddressForm() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <h1>Editar dirección</h1>
      <form className="narrow-form wide" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="addr-label">Nombre de la dirección</label>
          <input type="text" id="addr-label" defaultValue="Casa" required />
        </div>
        <div className="field-group">
          <label htmlFor="addr-fullname">Nombre completo</label>
          <input type="text" id="addr-fullname" defaultValue="Juan Pérez" required />
        </div>
        <div className="field-group">
          <label htmlFor="addr-street">Dirección</label>
          <input type="text" id="addr-street" defaultValue="Cra 45 # 72-30, Apto 501" required />
        </div>
        <div className="field-grid">
          <div className="field-group">
            <label htmlFor="addr-city">Ciudad</label>
            <input type="text" id="addr-city" defaultValue="Barranquilla" required />
          </div>
          <div className="field-group">
            <label htmlFor="addr-department">Departamento</label>
            <input type="text" id="addr-department" defaultValue="Atlántico" required />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="addr-phone">Teléfono</label>
          <input type="tel" id="addr-phone" defaultValue="300 123 4567" required />
        </div>
        <label className="checkbox-row">
          <input type="checkbox" defaultChecked /> Usar como dirección predeterminada
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-fill">Guardar dirección</button>
          <Link to="/account/addresses" className="btn btn-outline">Cancelar</Link>
        </div>
        {saved && <p className="form-feedback">¡Dirección guardada!</p>}
      </form>
    </>
  )
}

export default AddressForm
