import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../favorites/useFavorites.js'
import { formatCOP } from '../utils/formatCurrency.js'
import { coverImage } from '../utils/productImages.js'
import './ProductCard.css'

function ProductCard({ product }) {
  const { isFavorite, toggle } = useFavorites()
  const wishlisted = isFavorite(product.id)
  const href = `/products/${product.id}`
  const soldOut = product.variants.every((variant) => variant.stock === 0)
  const cover = coverImage(product)
  // Si la foto no llega (red caída, archivo borrado), se muestra el recuadro en vez del ícono de imagen rota.
  const [failedUrl, setFailedUrl] = useState(null)
  const showPhoto = cover && cover.thumbnailUrl !== failedUrl

  return (
    <article className="product-card">
      {showPhoto ? (
        <Link to={href} className="card-image" aria-label={product.name} tabIndex={-1}>
          <img src={cover.thumbnailUrl} alt="" loading="lazy" decoding="async" onError={() => setFailedUrl(cover.thumbnailUrl)} />
        </Link>
      ) : (
        <Link to={href} className="placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.4" />
            <path d="M21 15l-5-5-4 4-3-3-6 6" />
          </svg>
          <span>[imagen]</span>
        </Link>
      )}

      {soldOut && <span className="badge">Agotado</span>}

      <button
        type="button"
        className={wishlisted ? 'wishlist-btn active' : 'wishlist-btn'}
        aria-label={wishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={() => toggle(product)}
      >
        <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.36l-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 9.61 3 11.34L12 20l9-8.66c1.67-1.73 1.54-4.64-.58-6.76Z" />
        </svg>
      </button>

      <div className="info">
        <Link to={href} className="name">{product.name}</Link>
        <div className="price">{formatCOP(product.price)}</div>
      </div>
    </article>
  )
}

export default ProductCard
