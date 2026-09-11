import { Link } from 'react-router-dom'
import '../account-shared.css'

const items = [
  {
    name: 'Tenis Revolution Negro',
    variant: 'Talla 40 · Negro · Cantidad: 1',
    price: '$289.900',
  },
  {
    name: 'Zapato Oxford Café',
    variant: 'Talla 42 · Café · Cantidad: 1',
    price: '$389.900',
  },
]

function OrderDetail() {
  return (
    <>
      <h1>Pedido #A-10452</h1>
      <div className="order-detail-meta">
        <span className="status-badge on">Entregado</span>
        <span className="order-date">Realizado el 20 ago 2026</span>
      </div>

      <h2 className="section-heading">Productos</h2>
      <div className="order-detail-items">
        {items.map((item) => (
          <div key={item.name} className="order-line">
            <Link to="/product-detail" className="placeholder"><span>[imagen]</span></Link>
            <div className="item-info">
              <Link to="/product-detail" className="name">{item.name}</Link>
              <div className="variant">{item.variant}</div>
            </div>
            <div className="price">{item.price}</div>
          </div>
        ))}
      </div>

      <div className="order-detail-grid">
        <div>
          <h2 className="section-heading">Dirección de envío</h2>
          <div className="detail">
            Juan Pérez · Cra 45 # 72-30, Apto 501
            <br />
            Barranquilla, Atlántico · Tel: 300 123 4567
          </div>
        </div>
        <div>
          <h2 className="section-heading">Resumen</h2>
          <div className="order-summary-row"><span>Subtotal</span><span>$679.800</span></div>
          <div className="order-summary-row"><span>Envío</span><span>Gratis</span></div>
          <div className="order-summary-row total"><span>Total</span><span>$679.800</span></div>
        </div>
      </div>

      <Link to="/account/orders" className="btn btn-outline" style={{ marginTop: '32px' }}>Volver a mis pedidos</Link>
    </>
  )
}

export default OrderDetail
