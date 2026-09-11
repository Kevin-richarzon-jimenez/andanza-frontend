import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import '../account-shared.css'

const initialOrders = [
  {
    id: 'A-10452',
    status: 'Entregado',
    statusClass: 'on',
    date: 'Realizado el 20 ago 2026',
    thumbCount: 2,
    total: '$679.800',
  },
  {
    id: 'A-10398',
    status: 'En camino',
    statusClass: 'off',
    date: 'Realizado el 2 sep 2026',
    thumbCount: 1,
    total: '$459.900',
  },
]

function Orders() {
  const [orders] = useState(initialOrders)

  return (
    <>
      <h1>Mis pedidos</h1>

      {orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-top">
                <span className="order-id">Pedido #{order.id}</span>
                <span className={`status-badge ${order.statusClass}`}>{order.status}</span>
              </div>
              <div className="order-date">{order.date}</div>
              <div className="order-thumbs">
                {Array.from({ length: order.thumbCount }, (_, i) => (
                  <div key={i} className="placeholder" />
                ))}
              </div>
              <div className="order-bottom">
                <span className="order-total">{order.total}</span>
                <Link to="/account/order-detail" className="btn btn-outline btn-small">Ver detalle</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          )}
          title="Todavía no tienes pedidos"
          text="Cuando compres algo, aparecerá aquí."
          ctaText="Explorar catálogo"
          ctaHref="/catalog"
        />
      )}
    </>
  )
}

export default Orders
