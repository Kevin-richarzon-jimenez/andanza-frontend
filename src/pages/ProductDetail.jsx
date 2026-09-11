import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Stars from '../components/Stars.jsx'
import Review from '../components/Review.jsx'
import ProductCard from '../components/ProductCard.jsx'
import './ProductDetail.css'

const COLORS = [
  { label: 'Negro', hex: '#14151C' },
  { label: 'Café', hex: '#8B5E3C', outline: true },
]
const SIZES = [38, 40, 41, 42]

const TABS = [
  { key: 'description', label: 'Descripción' },
  { key: 'details', label: 'Información adicional' },
  { key: 'reviews', label: 'Comentarios (120)' },
]

const initialReviews = [
  { author: 'Laura Gómez', rating: 5, text: 'Excelente calidad, la talla es exacta a la de siempre. Muy cómodos desde el primer uso.', date: '28 ago 2026' },
  { author: 'Andrés Ruiz', rating: 4, text: 'Buen producto, aunque el envío tardó un par de días más de lo esperado.', date: '15 ago 2026' },
]

const relatedProducts = [
  { name: 'Tenis Suede Clásico', price: '$249.900' },
  { name: 'Tenis Old Skool Negro', price: '$259.900' },
  { name: 'Tenis 574 Gris', price: '$329.900' },
  { name: 'Mocasín Driver Solano', price: '$419.900', initiallyWishlisted: true },
]

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function ProductDetail() {
  const [color, setColor] = useState('Negro')
  const [size, setSize] = useState(40)
  const [favorite, setFavorite] = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [addedToCart, setAddedToCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState(initialReviews)
  const reviewsRef = useRef(null)

  function handleTabClick(key) {
    if (key === 'reviews') {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setActiveTab(key)
  }

  function handleAddToCart() {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1200)
  }

  function handleReviewSubmit(event) {
    event.preventDefault()
    if (!reviewText.trim()) return

    const today = new Date()
    const dateLabel = `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`

    setReviews((current) => [
      { author: 'Juan Pérez', rating, text: reviewText.trim(), date: dateLabel },
      ...current,
    ])
    setReviewText('')
    setRating(5)
    setShowReviewForm(false)
  }

  return (
    <>
      <div className="breadcrumb">
        <span><Link to="/">Inicio</Link> &gt; <Link to="/catalog">Tenis</Link> &gt; Tenis Revolution Negro</span>
      </div>

      <main className="product-body">
        <div className="gallery">
          <div className="main-image placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.4" />
              <path d="M21 15l-5-5-4 4-3-3-6 6" />
            </svg>
            <span>[imagen principal]</span>
          </div>
          <div className="thumbs">
            <div className="placeholder"><span>[img]</span></div>
            <div className="placeholder"><span>[img]</span></div>
            <div className="placeholder"><span>[img]</span></div>
          </div>
        </div>

        <div className="product-info">
          <div className="product-brand">NIKE</div>
          <h1 className="product-name">Tenis Revolution Negro</h1>
          <div className="product-rating">
            <Stars rating={5} />
            <span className="review-count">({reviews.length + 118} reseñas)</span>
          </div>
          <div className="product-price">$289.900</div>

          <div className="field-label">Color</div>
          <div className="color-options">
            {COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={c.label === color ? 'swatch selected' : 'swatch'}
                style={{ background: c.hex, border: c.outline ? '1px solid #ddd' : undefined }}
                aria-label={c.label}
                onClick={() => setColor(c.label)}
              />
            ))}
          </div>

          <div className="field-label">Talla</div>
          <div className="size-options">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={s === size ? 'pill selected' : 'pill'}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="stock-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.27 2.82 1.66 20.03A2 2 0 0 0 3.42 23h17.15a2 2 0 0 0 1.76-2.97L13.73 2.82a2 2 0 0 0-3.46 0Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            Quedan <strong>8 unidades</strong> disponibles en talla {size}
          </div>

          <div className="product-actions">
            <button
              type="button"
              className={favorite ? 'btn btn-outline favorite-toggle active' : 'btn btn-outline favorite-toggle'}
              onClick={() => setFavorite((f) => !f)}
            >
              <span className="favorite-label">{favorite ? 'En favoritos' : 'Agregar a favoritos'}</span> ♥
            </button>
            <button type="button" className="btn btn-fill add-to-cart" disabled={addedToCart} onClick={handleAddToCart}>
              {addedToCart ? 'Agregado ✓' : 'Agregar al carrito'}
            </button>
          </div>

          <div className="product-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeTab === tab.key ? 'active' : ''}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div hidden={activeTab !== 'description'}>
            <p className="product-description">Zapatilla ligera de uso diario, con entresuela flexible y agarre estable pensado para trayectos largos sin perder comodidad.</p>
          </div>
          <div hidden={activeTab !== 'details'}>
            <ul className="detail-list">
              <li><strong>Material:</strong> malla transpirable con refuerzos sintéticos.</li>
              <li><strong>Suela:</strong> goma antideslizante.</li>
              <li><strong>Cuidado:</strong> limpiar con paño húmedo, no sumergir en agua.</li>
              <li><strong>Origen:</strong> importado.</li>
            </ul>
          </div>

          <section className="reviews" ref={reviewsRef}>
            <div className="reviews-header">
              <h2>Comentarios y calificaciones</h2>
              {!showReviewForm && (
                <button type="button" className="btn btn-outline btn-small" onClick={() => setShowReviewForm(true)}>
                  Escribir un comentario
                </button>
              )}
            </div>

            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="field-label">Tu calificación</div>
                <div className="review-star-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= rating ? 'selected' : ''}
                      aria-label={`${value} estrella${value === 1 ? '' : 's'}`}
                      onClick={() => setRating(value)}
                    >
                      <svg className="star-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="¿Qué te pareció el producto?"
                  required
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-fill btn-small">Publicar</button>
                  <button type="button" className="btn btn-outline btn-small" onClick={() => setShowReviewForm(false)}>Cancelar</button>
                </div>
              </form>
            )}

            <div>
              {reviews.map((review, i) => (
                <Review key={`${review.author}-${i}`} {...review} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <section>
        <h2 className="section-title">Productos relacionados</h2>
        <div className="product-grid">
          {relatedProducts.map((product) => (
            <ProductCard key={product.name} href="/product-detail" {...product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default ProductDetail
