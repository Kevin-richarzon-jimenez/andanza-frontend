import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import '../account-shared.css'

const initialAddresses = [
  {
    id: 1,
    isDefault: true,
    label: 'Casa',
    name: 'Juan Pérez',
    street: 'Cra 45 # 72-30, Apto 501',
    city: 'Barranquilla, Atlántico',
    phone: '300 123 4567',
  },
  {
    id: 2,
    isDefault: false,
    label: 'Oficina',
    name: 'Juan Pérez',
    street: 'Calle 84 # 10-15, Piso 3',
    city: 'Barranquilla, Atlántico',
    phone: '300 123 4567',
  },
]

function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [removingId, setRemovingId] = useState(null)

  function handleDelete(id) {
    setRemovingId(id)
    setTimeout(() => {
      setAddresses((current) => current.filter((address) => address.id !== id))
      setRemovingId(null)
    }, 200)
  }

  return (
    <>
      <h1>Mis direcciones</h1>

      {addresses.length > 0 ? (
        <div>
          {addresses.map((address) => (
            <div
              key={address.id}
              className="address-card"
              style={{ opacity: removingId === address.id ? 0 : 1 }}
            >
              {address.isDefault && <span className="default-tag">Predeterminada</span>}
              <div className="label">{address.label}</div>
              <div className="detail">
                {address.name} · {address.street}
                <br />
                {address.city} · Tel: {address.phone}
              </div>
              <div className="address-actions">
                <Link to="/account/address-form" className="btn btn-outline btn-small">Editar</Link>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => handleDelete(address.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
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

      <Link to="/account/address-form" className="btn btn-fill">+ Agregar dirección</Link>
    </>
  )
}

export default Addresses
