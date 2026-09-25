import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { listCategories, listProducts } from '../api/catalog.js'
import { subscribeToNewsletter } from '../api/contact.js'
import './Home.css'

function Home() {
  const [newsletter, setNewsletter] = useState({ status: 'idle', message: '' })
  const { data: latest, error: latestError, reload: reloadLatest } = useApiData(() => listProducts({ sort: 'newest', size: 4 }), 'home-latest')
  const { data: categories } = useApiData(listCategories, 'categories')

  async function handleSubscribe(event) {
    event.preventDefault()
    const form = event.target
    setNewsletter({ status: 'sending', message: '' })
    try {
      const response = await subscribeToNewsletter(new FormData(form).get('email'))
      setNewsletter({ status: 'done', message: response.message })
      form.reset()
    } catch (error) {
      setNewsletter({ status: 'error', message: error.message })
    }
  }

  return (
    <>
      <section className="hero">
        <div className="banner">
          <div className="banner-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.4" />
              <path d="M21 15l-5-5-4 4-3-3-6 6" />
            </svg>
            <span>[imagen de portada]</span>
          </div>
        </div>
        <div className="content">
          <div className="copy">
            <h1>Cada zapato empieza una <span className="accent">andanza</span>.</h1>
            <p>Reunimos calzado de distintas marcas para cada tipo de recorrido: la ciudad, la oficina, la montaña o el día a día.</p>
            <Link to="/catalog" className="btn btn-fill">Explorar catálogo</Link>
          </div>
        </div>
      </section>

      <div className="trust-row">
        <div className="trust-item">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <div>
            <div className="title">Cambios en 30 días</div>
            <div className="subtitle">Talla o modelo, sin costo</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 13c0 5-3.5 7.5-7.35 8.95a1 1 0 0 1-1.3 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.79 17 5 19 5a1 1 0 0 1 1 1Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="title">Pago seguro</div>
            <div className="subtitle">Tarjeta, PSE o contraentrega</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="title">Marcas originales</div>
            <div className="subtitle">100% verificadas</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Novedades</h2>
      {latestError ? (
        <div className="page-status" role="alert">
          <p>{latestError.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reloadLatest}>Reintentar</button>
        </div>
      ) : (
        <div className="product-grid">
          {latest
            ? latest.content.map((product) => <ProductCard key={product.id} product={product} />)
            : Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      )}

      {categories && categories.length > 0 && (
        <>
          <h2 className="section-title">Compra por categoría</h2>
          <div className="brand-row">
            {categories.map((category) => (
              <Link key={category.id} to={`/catalog?category=${encodeURIComponent(category.name)}`} className="brand-chip">
                {category.name}
              </Link>
            ))}
          </div>
        </>
      )}

      <section className="newsletter">
        <div className="newsletter-copy">
          <div className="newsletter-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h3>Recibe 15% de descuento en tu primera compra</h3>
            <p>Suscríbete y entérate antes que nadie de nuevas colecciones y ofertas.</p>
          </div>
        </div>
        <form onSubmit={handleSubscribe}>
          <input type="email" name="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico" required />
          <button type="submit" disabled={newsletter.status === 'sending'}>Suscribirme</button>
        </form>
        {newsletter.status === 'done' && <p className="form-feedback">{newsletter.message}</p>}
        {newsletter.status === 'error' && <p className="form-error" role="alert">{newsletter.message}</p>}
      </section>
    </>
  )
}

export default Home
