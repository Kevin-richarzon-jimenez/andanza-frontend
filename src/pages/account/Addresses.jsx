import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { deleteAddress, listAddresses } from '../../api/addresses.js'
import '../account-shared.css'

function Addresses() {
  const confirm = useConfirm()
  const { data: addresses, error, reload } = useApiData(listAddresses, 'addresses')
  const [removingId, setRemovingId] = useState(null)
  const [removeError, setRemoveError] = useState(null)

  async function handleDelete(address) {
    const promotesAnother = address.isDefault && addresses.length > 1
    const confirmed = await confirm({
      title: '¿Eliminar esta dirección?',
      message: `Se eliminará «${address.label}» (${address.street}). Esta acción no se puede deshacer.${promotesAnother ? ' Otra dirección pasará a ser la predeterminada.' : ''}`,
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return

    setRemovingId(address.id)
    setRemoveError(null)
    try {
      await deleteAddress(address.id)
      reload()
    } catch (err) {
      setRemoveError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <>
      <h1>Mis direcciones</h1>

      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !addresses && <div className="page-status">Cargando direcciones...</div>}
      {removeError && <p className="form-error" role="alert">{removeError}</p>}

      {addresses && addresses.length > 0 && (
        <div>
          {addresses.map((address) => (
            <div
              key={address.id}
              className="address-card"
              style={{ opacity: removingId === address.id ? 0.4 : 1 }}
            >
              {address.isDefault && <span className="default-tag">Predeterminada</span>}
              <div className="label">{address.label}</div>
              <div className="detail">
                {address.recipientName} · {address.street}
                <br />
                {address.city}, {address.department} · Tel: {address.phone}
              </div>
              <div className="address-actions">
                <Link to={`/account/addresses/${address.id}/edit`} className="btn btn-outline btn-small">Editar</Link>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  disabled={removingId === address.id}
                  onClick={() => handleDelete(address)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {addresses && addresses.length === 0 && (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          )}
          title="No tienes direcciones guardadas"
          text="Agrega una dirección para agilizar tus próximas compras."
        />
      )}

      <Link to="/account/addresses/new" className="btn btn-fill">+ Agregar dirección</Link>
    </>
  )
}

export default Addresses
