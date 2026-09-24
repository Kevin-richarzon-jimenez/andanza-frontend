import { Link } from 'react-router-dom'
import { useCart } from '../cart/useCart.js'
import { useConfirm } from '../confirm/useConfirm.js'
import { useApiData } from '../hooks/useApiData.js'
import { calculateTotals } from '../api/cart.js'
import { formatCOP } from '../utils/formatCurrency.js'
import './Cart.css'

function Cart() {
  const { items, setQuantity, remove, clear } = useCart()
  const confirm = useConfirm()

  // Con una sola unidad, "−" quita el producto: se pide confirmar para que un doble clic rápido no lo borre.
  async function handleDecrease(item) {
    if (item.quantity > 1) {
      setQuantity(item.variantId, item.quantity - 1)
      return
    }
    const confirmed = await confirm({
      title: '¿Quitar del carrito?',
      message: `Se quitará ${item.name} (talla ${item.size}, ${item.color}).`,
      confirmLabel: 'Quitar',
    })
    if (confirmed) remove(item.variantId)
  }

  async function handleClear() {
    const confirmed = await confirm({
      title: '¿Vaciar el carrito?',
      message: 'Se quitarán todos los productos de tu carrito.',
      confirmLabel: 'Vaciar carrito',
    })
    if (confirmed) clear()
  }

  // El backend recalcula precio, stock, descuento y envío con lo que hay en el carrito.
  const totalsKey = items.map((item) => `${item.variantId}x${item.quantity}`).join(',')
  const { data: totals, error } = useApiData(
    () => (items.length > 0
      ? calculateTotals(items.map(({ variantId, quantity }) => ({ variantId, quantity })))
      : Promise.resolve(null)),
    `totals:${totalsKey}`,
  )

  const shipping = totals && (Number(totals.shipping) === 0 ? 'Gratis' : formatCOP(totals.shipping))

  return (
    <>
      <h1 className="cart-title">Mi carrito</h1>
      <main className="cart-body">
        <div className="cart-list">
          {items.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío. <Link to="/catalog">Ver catálogo</Link></p>
          ) : (
            items.map((item) => (
              <div className="cart-row" key={item.variantId}>
                <Link to={`/products/${item.productId}`} className="placeholder"><span>[imagen]</span></Link>
                <div className="item-info">
                  <Link to={`/products/${item.productId}`} className="name">{item.name}</Link>
                  <div className="variant">Talla {item.size} · {item.color}</div>
                  {item.quantity > 1 && <div className="unit-price">{formatCOP(item.unitPrice)} c/u</div>}
                </div>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className={item.quantity <= 1 ? 'is-remove' : ''}
                    aria-label={item.quantity <= 1 ? 'Eliminar del carrito' : 'Disminuir cantidad'}
                    onClick={() => handleDecrease(item)}
                  >
                    {item.quantity <= 1 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    ) : '−'}
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity(item.variantId, item.quantity + 1)}>+</button>
                </div>
                <div className="line-total">{formatCOP(item.unitPrice * item.quantity)}</div>
              </div>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <h2>Resumen del pedido</h2>
          {error && (
            <div role="alert">
              <p className="form-error" style={{ marginTop: 0 }}>{error.message}</p>
              {error.status === 422 && (
                <button type="button" className="clear-cart" onClick={handleClear}>Vaciar carrito</button>
              )}
            </div>
          )}
          <div className="summary-row"><span>Subtotal</span><span>{totals ? formatCOP(totals.subtotal) : '—'}</span></div>
          <div className="summary-row"><span>Envío</span><span>{shipping ?? '—'}</span></div>
          <div className="summary-row total"><span>Total</span><span>{totals ? formatCOP(totals.total) : '—'}</span></div>
          <button type="button" className="btn btn-fill" disabled>Finalizar compra</button>
          <p className="cart-note">El pago en línea estará disponible pronto.</p>
        </aside>
      </main>
    </>
  )
}

export default Cart
