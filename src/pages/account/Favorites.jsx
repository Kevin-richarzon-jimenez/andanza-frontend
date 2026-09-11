import { useState } from 'react'
import ProductCard from '../../components/ProductCard.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import '../account-shared.css'

const initialFavorites = [
  { name: 'Tenis Revolution Negro', price: '$289.900' },
  { name: 'Bota 6-Inch Trigo', price: '$459.900' },
  { name: 'Zapato Oxford Café', price: '$389.900' },
]

function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites)

  function handleRemove(name) {
    setFavorites((current) => current.filter((product) => product.name !== name))
  }

  return (
    <>
      <h1>Mis favoritos</h1>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((product) => (
            // ProductCard manages its wishlist heart internally and doesn't expose
            // a callback, so we listen for the click bubbling up from its
            // ".wishlist-btn" and drop the product from this page's own list —
            // that's what makes the grid (and eventually the empty state) update.
            <div
              key={product.name}
              onClick={(event) => {
                if (event.target.closest('.wishlist-btn')) {
                  handleRemove(product.name)
                }
              }}
            >
              <ProductCard
                href="/product-detail"
                name={product.name}
                price={product.price}
                initiallyWishlisted
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={(
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.36l-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 9.61 3 11.34L12 20l9-8.66c1.67-1.73 1.54-4.64-.58-6.76Z" />
            </svg>
          )}
          title="Todavía no tienes favoritos"
          text="Guarda los productos que te gusten para encontrarlos rápido después."
          ctaText="Explorar catálogo"
          ctaHref="/catalog"
        />
      )}
    </>
  )
}

export default Favorites
