import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Stars from '../components/Stars.jsx'
import Review from '../components/Review.jsx'
import ReviewSummary from '../components/ReviewSummary.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useAuth } from '../auth/useAuth.js'
import { useAuthPrompt } from '../auth/useAuthPrompt.js'
import { useCart } from '../cart/useCart.js'
import { useFavorites } from '../favorites/useFavorites.js'
import { getProduct, listProducts } from '../api/catalog.js'
import { createComment, listProductComments } from '../api/comments.js'
import { swatchFor } from '../utils/colors.js'
import { describeError } from '../utils/formErrors.js'
import { formatCOP } from '../utils/formatCurrency.js'
import { formatRating } from '../utils/formatRating.js'
import { formatDate } from '../utils/formatDate.js'
import './ProductDetail.css'

const LOW_STOCK = 10
const PERKS = [
  { title: 'Cambios en 30 días.', text: 'Talla o modelo, sin costo.' },
  { title: 'Pago seguro.', text: 'Tarjeta, PSE o contraentrega.' },
  { title: 'Marcas originales.', text: '100 % verificadas.' },
]

function firstAvailableSize(variants, color) {
  const ofColor = variants.filter((variant) => variant.color === color)
  return (ofColor.find((variant) => variant.stock > 0) ?? ofColor[0])?.size ?? null
}

function StockNote({ variant }) {
  if (!variant) return null
  let text = `Disponible en talla ${variant.size}`
  if (variant.stock === 0) {
    text = `Agotado en talla ${variant.size}`
  } else if (variant.stock <= LOW_STOCK) {
    text = (
      <>
        Quedan <strong>{variant.stock} {variant.stock === 1 ? 'unidad' : 'unidades'}</strong> disponibles en talla {variant.size}
      </>
    )
  }
  return (
    <div className="stock-note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.27 2.82 1.66 20.03A2 2 0 0 0 3.42 23h17.15a2 2 0 0 0 1.76-2.97L13.73 2.82a2 2 0 0 0-3.46 0Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </svg>
      <span>{text}</span>
    </div>
  )
}

// La ficha se abre desde muchos lados: "Volver" regresa a la página anterior tal cual (con filtros); sin historial, va al catálogo.
function BackLink() {
  const navigate = useNavigate()
  const location = useLocation()
  const arrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )

  return (
    <div className="back-bar">
      {location.key !== 'default' ? (
        <button type="button" className="back-link" onClick={() => navigate(-1)}>{arrow}Volver</button>
      ) : (
        <Link to="/catalog" className="back-link">{arrow}Ver catálogo</Link>
      )}
    </div>
  )
}

function ProductView({ product }) {
  const { isAuthenticated } = useAuth()
  const { requireLogin } = useAuthPrompt()
  const { add } = useCart()
  const { isFavorite, toggle } = useFavorites()
  const { data: comments, error: commentsError, reload: reloadComments } = useApiData(() => listProductComments(product.id), `comments:${product.id}`)
  const { data: related } = useApiData(() => listProducts({ category: product.category.name, size: 5 }), `related:${product.id}`)

  const colors = [...new Set(product.variants.map((variant) => variant.color))]
  const initialColor = colors.find((color) => product.variants.some((variant) => variant.color === color && variant.stock > 0)) ?? colors[0]
  const [color, setColor] = useState(initialColor)
  const [size, setSize] = useState(() => firstAvailableSize(product.variants, initialColor))
  const [addedToCart, setAddedToCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSending, setReviewSending] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [publishedNotice, setPublishedNotice] = useState(false)
  const [newReviewId, setNewReviewId] = useState(null)
  const reviewsRef = useRef(null)

  const sizes = product.variants.filter((variant) => variant.color === color)
  const variant = sizes.find((item) => item.size === size)
  const favorite = isFavorite(product.id)
  const reviews = comments ?? []
  const hasReviews = reviews.length > 0
  const average = hasReviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0
  const relatedProducts = (related?.content ?? []).filter((item) => item.id !== product.id).slice(0, 4)
  const allSizes = [...new Set(product.variants.map((item) => item.size))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  function handleColorClick(nextColor) {
    setColor(nextColor)
    setSize(firstAvailableSize(product.variants, nextColor))
  }

  function scrollToReviews() {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleAddToCart() {
    add({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      color: variant.color,
      size: variant.size,
      unitPrice: product.price,
      quantity: 1,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1200)
  }

  function handleWriteReview() {
    if (!isAuthenticated) {
      requireLogin('Para dejar un comentario debes iniciar sesión o crear una cuenta.')
      return
    }
    setPublishedNotice(false)
    setShowReviewForm(true)
  }

  async function handleReviewSubmit(event) {
    event.preventDefault()
    if (!reviewText.trim()) return
    setReviewSending(true)
    setReviewError(null)
    try {
      const created = await createComment({ productId: product.id, rating, text: reviewText.trim() })
      setReviewText('')
      setRating(5)
      setShowReviewForm(false)
      setNewReviewId(created.id)
      setPublishedNotice(true)
      setTimeout(() => setPublishedNotice(false), 8000)
      reloadComments()
    } catch (error) {
      setReviewError(describeError(error))
    } finally {
      setReviewSending(false)
    }
  }

  return (
    <>
      <BackLink />

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
          <div className="product-brand">{product.brand.toUpperCase()}</div>
          <h1 className="product-name">{product.name}</h1>
          {comments && (
            <button type="button" className="product-rating" onClick={scrollToReviews}>
              {hasReviews ? (
                <>
                  <Stars rating={Math.round(average)} />
                  <span className="review-count">{formatRating(average)} · {reviews.length} {reviews.length === 1 ? 'comentario' : 'comentarios'}</span>
                </>
              ) : (
                <span className="review-count">Aún sin comentarios</span>
              )}
            </button>
          )}
          <div className="product-price">{formatCOP(product.price)}</div>

          <div className="field-label">Color</div>
          <div className="color-options">
            {colors.map((name) => {
              const swatch = swatchFor(name)
              return (
                <button
                  key={name}
                  type="button"
                  className={name === color ? 'swatch selected' : 'swatch'}
                  style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }}
                  aria-label={name}
                  title={name}
                  onClick={() => handleColorClick(name)}
                />
              )
            })}
          </div>

          <div className="field-label">Talla</div>
          <div className="size-options">
            {sizes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.size === size ? 'pill selected' : 'pill'}
                style={item.stock === 0 ? { opacity: 0.45, textDecoration: 'line-through' } : undefined}
                onClick={() => setSize(item.size)}
              >
                {item.size}
              </button>
            ))}
          </div>
          <StockNote variant={variant} />

          <div className="product-actions">
            <button
              type="button"
              className={favorite ? 'btn btn-outline favorite-toggle active' : 'btn btn-outline favorite-toggle'}
              onClick={() => toggle(product)}
            >
              <span className="favorite-label">{favorite ? 'En favoritos' : 'Agregar a favoritos'}</span> ♥
            </button>
            <button
              type="button"
              className="btn btn-fill add-to-cart"
              disabled={!variant || variant.stock === 0 || addedToCart}
              onClick={handleAddToCart}
            >
              {addedToCart ? 'Agregado ✓' : variant?.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>

          <ul className="product-perks">
            {PERKS.map((perk) => (
              <li key={perk.title}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 3 3 5-6" />
                </svg>
                <span><strong>{perk.title}</strong> {perk.text}</span>
              </li>
            ))}
          </ul>

        </div>
      </main>

      <div className="product-sections">
        <section className="product-about">
          <div>
            <h2>Descripción</h2>
            <p className="product-description">{product.description || 'Este producto todavía no tiene descripción.'}</p>
          </div>
          <div>
            <h2>Detalles</h2>
            <dl className="product-details">
              <div><dt>Marca</dt><dd>{product.brand}</dd></div>
              <div><dt>Categoría</dt><dd>{product.category.name}</dd></div>
              <div><dt>Colores</dt><dd>{colors.join(', ')}</dd></div>
              <div><dt>Tallas</dt><dd>{allSizes.join(', ')}</dd></div>
            </dl>
          </div>
        </section>

        <section className="reviews" ref={reviewsRef} aria-labelledby="reviews-title">
          <h2 id="reviews-title">Comentarios y calificaciones</h2>

          {commentsError && (
            <div className="page-status" role="alert">
              <p>{commentsError.message}</p>
              <button type="button" className="btn btn-outline btn-small" onClick={reloadComments}>Reintentar</button>
            </div>
          )}
          {!commentsError && !comments && <p className="reviews-status">Cargando comentarios...</p>}

          {!commentsError && comments && (
            <div className={hasReviews ? 'reviews-layout' : 'reviews-layout single'}>
              {hasReviews && (
                <aside className="reviews-side">
                  <ReviewSummary reviews={reviews} />
                  {!showReviewForm && (
                    <button type="button" className="btn btn-outline" onClick={handleWriteReview}>Escribir un comentario</button>
                  )}
                </aside>
              )}

              <div className="reviews-main">
                {publishedNotice && (
                  <div className="review-notice" role="status">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m8 12 3 3 5-6" />
                    </svg>
                    <div>
                      <strong>¡Gracias por tu opinión!</strong>
                      <p>Tu comentario ya está publicado y ayuda a otras personas a elegir.</p>
                    </div>
                  </div>
                )}

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
                      minLength={5}
                      maxLength={500}
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                    />
                    <div className="review-counter">{reviewText.length}/500</div>
                    {reviewError && (
                      <p className="form-error" role="alert">{reviewError.fields.text ?? reviewError.message}</p>
                    )}
                    <div className="form-actions">
                      <button type="submit" className="btn btn-fill btn-small" disabled={reviewSending}>
                        {reviewSending ? 'Publicando...' : 'Publicar'}
                      </button>
                      <button type="button" className="btn btn-outline btn-small" onClick={() => setShowReviewForm(false)}>Cancelar</button>
                    </div>
                  </form>
                )}

                {!hasReviews && !showReviewForm && !publishedNotice && (
                  <div className="reviews-empty">
                    <strong>Aún no hay comentarios de este producto</strong>
                    <p>Cuéntanos qué te pareció y ayuda a otras personas a elegir.</p>
                    <button type="button" className="btn btn-outline" onClick={handleWriteReview}>Sé el primero en comentar</button>
                  </div>
                )}

                {reviews.map((review) => (
                  <Review
                    key={review.id}
                    author={review.authorName}
                    rating={review.rating}
                    text={review.text}
                    date={formatDate(review.createdAt)}
                    isNew={review.id === newReviewId}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="section-title">Productos relacionados</h2>
          <div className="product-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const { data: product, error, reload } = useApiData(() => getProduct(id), `product:${id}`)

  if (error) {
    if (error.status === 404 || error.status === 400) {
      return (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          )}
          title="No encontramos este producto"
          text="Puede que ya no esté disponible o que el enlace sea incorrecto."
          ctaText="Ver catálogo"
          ctaHref="/catalog"
        />
      )
    }
    return (
      <div className="page-status" role="alert">
        <p>{error.message}</p>
        <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
      </div>
    )
  }

  if (!product || product.id !== id) return <div className="page-status">Cargando producto...</div>

  return <ProductView key={product.id} product={product} />
}

export default ProductDetail
