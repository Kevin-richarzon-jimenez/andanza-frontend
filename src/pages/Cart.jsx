import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'

const initialItems = [
  { id: 1, name: 'Tenis Revolution Negro', variant: 'Talla 40 · Negro', price: 289900, qty: 1 },
  { id: 2, name: 'Zapato Oxford Café', variant: 'Talla 42 · Café', price: 389900, qty: 1 },
  { id: 3, name: 'Bota 6-Inch Trigo', variant: 'Talla 41 · Óxido', price: 459900, qty: 1 },
]

function formatCOP(amount) {
  return '$' + amount.toLocaleString('es-CO')
}

function Cart() {
  const [items, setItems] = useState(initialItems)

  function increase(id) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)))
  }

  function decrease(id) {
    setItems((current) => {
      const item = current.find((i) => i.id === id)
      if (item.qty <= 1) return current.filter((i) => i.id !== id)
      return current.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
    })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      <h1 className="cart-title">Mi carrito</h1>
      <main className="cart-body">
        <div className="cart-list">
          {items.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío. <Link to="/catalog">Ver catálogo</Link></p>
          ) : (
            items.map((item) => (
              <div className="cart-row" key={item.id}>
                <Link to="/product-detail" className="placeholder"><span>[imagen]</span></Link>
                <div className="item-info">
                  <Link to="/product-detail" className="name">{item.name}</Link>
                  <div className="variant">{item.variant}</div>
                  <div className="price">{formatCOP(item.price * item.qty)}</div>
                </div>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className={item.qty <= 1 ? 'is-remove' : ''}
                    aria-label={item.qty <= 1 ? 'Eliminar del carrito' : 'Disminuir cantidad'}
                    onClick={() => decrease(item.id)}
                  >
                    {item.qty <= 1 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    ) : '−'}
                  </button>
                  <span className="quantity-value">{item.qty}</span>
                  <button type="button" aria-label="Aumentar cantidad" onClick={() => increase(item.id)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <div className="summary-row"><span>Subtotal</span><span>{formatCOP(subtotal)}</span></div>
          <div className="summary-row"><span>Envío</span><span>Calculado al pagar</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatCOP(subtotal)}</span></div>
          <button type="button" className="btn btn-fill">Finalizar compra</button>
        </aside>
      </main>
    </>
  )
}

export default Cart
