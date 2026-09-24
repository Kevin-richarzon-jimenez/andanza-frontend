import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { createAddress, listAddresses, updateAddress } from '../../api/addresses.js'
import { describeError } from '../../utils/formErrors.js'
import '../account-shared.css'

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function AddressFields({ address }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const data = new FormData(form)
    const payload = {
      label: data.get('label'),
      recipientName: data.get('recipientName'),
      street: data.get('street'),
      city: data.get('city'),
      department: data.get('department'),
      phone: data.get('phone'),
      isDefault: data.get('isDefault') === 'on',
    }
    setSubmitting(true)
    setError(null)
    try {
      await (address ? updateAddress(address.id, payload) : createAddress(payload))
      navigate('/account/addresses')
    } catch (err) {
      setError(describeError(err))
      setSubmitting(false)
    }
  }

  const fields = error?.fields ?? {}

  return (
    <>
      <h1>{address ? 'Editar dirección' : 'Agregar dirección'}</h1>
      <form className="narrow-form wide" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="addr-label">Nombre de la dirección</label>
          <input type="text" id="addr-label" name="label" placeholder="Casa, Oficina..." defaultValue={address?.label} required maxLength={40} />
          <FieldError message={fields.label} />
        </div>
        <div className="field-group">
          <label htmlFor="addr-fullname">Nombre completo de quien recibe</label>
          <input type="text" id="addr-fullname" name="recipientName" defaultValue={address?.recipientName} required maxLength={80} />
          <FieldError message={fields.recipientName} />
        </div>
        <div className="field-group">
          <label htmlFor="addr-street">Dirección</label>
          <input type="text" id="addr-street" name="street" defaultValue={address?.street} required maxLength={150} />
          <FieldError message={fields.street} />
        </div>
        <div className="field-grid">
          <div className="field-group">
            <label htmlFor="addr-city">Ciudad</label>
            <input type="text" id="addr-city" name="city" defaultValue={address?.city} required maxLength={60} />
            <FieldError message={fields.city} />
          </div>
          <div className="field-group">
            <label htmlFor="addr-department">Departamento</label>
            <input type="text" id="addr-department" name="department" defaultValue={address?.department} required maxLength={60} />
            <FieldError message={fields.department} />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="addr-phone">Teléfono</label>
          <input type="tel" id="addr-phone" name="phone" defaultValue={address?.phone} required pattern="[0-9+ ]{7,15}" title="Entre 7 y 15 dígitos; puedes usar espacios y el signo +" />
          <FieldError message={fields.phone} />
        </div>
        <label className="checkbox-row">
          <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault} /> Usar como dirección predeterminada
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-fill" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar dirección'}
          </button>
          <Link to="/account/addresses" className="btn btn-outline">Cancelar</Link>
        </div>
        {error && !Object.keys(fields).length && <p className="form-error" role="alert">{error.message}</p>}
      </form>
    </>
  )
}

// La API no tiene "una dirección por id": para editar se busca en la lista del usuario.
function EditAddress({ id }) {
  const { data: addresses, error, reload } = useApiData(listAddresses, 'addresses')

  if (error) {
    return (
      <div className="page-status" role="alert">
        <p>{error.message}</p>
        <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
      </div>
    )
  }
  if (!addresses) return <div className="page-status">Cargando dirección...</div>

  const address = addresses.find((item) => item.id === id)
  if (!address) {
    return (
      <EmptyState
        icon={<span aria-hidden="true">?</span>}
        title="No encontramos esa dirección"
        text="Puede que ya la hayas eliminado."
        ctaText="Volver a mis direcciones"
        ctaHref="/account/addresses"
      />
    )
  }
  return <AddressFields address={address} />
}

function AddressForm() {
  const { id } = useParams()
  return id ? <EditAddress id={id} /> : <AddressFields address={null} />
}

export default AddressForm
