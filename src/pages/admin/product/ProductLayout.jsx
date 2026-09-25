import { useCallback, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import EmptyState from '../../../components/EmptyState.jsx'
import { useApiData } from '../../../hooks/useApiData.js'
import { getProduct, listCategories } from '../../../api/catalog.js'
import { formatCOP } from '../../../utils/formatCurrency.js'
import { coverImage } from '../../../utils/productImages.js'
import { groupColors } from './productData.js'
import '../admin-shared.css'
import './product.css'

function totalStock(product) {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0)
}

// Un producto en el panel: arriba su resumen y, debajo, sus secciones (General y Colores). Carga el producto una
// sola vez y se lo pasa a cada sección.
function ProductLayout() {
  const { id } = useParams()
  const location = useLocation()
  const { data: product, error: productError, reload } = useApiData(() => getProduct(id), `admin:product:${id}`)
  const { data: categories, error: categoriesError, reload: reloadCategories } = useApiData(listCategories, 'admin:categories')
  const [notice, setNotice] = useState(location.state?.notice ?? '')

  const notify = useCallback((message) => {
    setNotice(message)
    setTimeout(() => setNotice(''), 4500)
  }, [])

  if (productError?.status === 404 || productError?.status === 400) {
    return (
      <EmptyState
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        )}
        title="No encontramos este producto"
        text="Puede que ya se haya eliminado."
        ctaText="Volver a productos"
        ctaHref="/admin/products"
      />
    )
  }
  const error = productError ?? categoriesError
  if (error) {
    return (
      <div className="page-status" role="alert">
        <p>{error.message}</p>
        <button type="button" className="btn btn-outline btn-small" onClick={() => { reload(); reloadCategories() }}>Reintentar</button>
      </div>
    )
  }
  if (!product || !categories) return <div className="admin-empty">Cargando...</div>

  const colors = groupColors(product)
  const stock = totalStock(product)
  const cover = coverImage(product)

  return (
    <div className="pd-page">
      <Link to="/admin/products" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Productos
      </Link>

      <header className="pd-head">
        {cover ? <img className="pd-head-thumb" src={cover.thumbnailUrl} alt="" /> : <span className="pd-head-thumb is-empty" aria-hidden="true" />}
        <div className="pd-head-text">
          <h1>{product.name}</h1>
          <p>{product.brand} · {product.category.name} · {formatCOP(product.price)}</p>
        </div>
        <div className="pd-head-chips">
          <span className={stock === 0 ? 'chip is-out' : 'chip'}>{stock === 0 ? 'Agotado' : `${stock} unidades`}</span>
          <span className="chip">{colors.length} {colors.length === 1 ? 'color' : 'colores'} · {product.variants.length} {product.variants.length === 1 ? 'variante' : 'variantes'}</span>
        </div>
      </header>

      <nav className="pd-tabs" aria-label="Secciones del producto">
        <NavLink to={`/admin/products/${id}`} end>General</NavLink>
        <NavLink to={`/admin/products/${id}/colors`}>Colores <span className="pd-tab-count">{colors.length}</span></NavLink>
      </nav>

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <Outlet context={{ product, categories, reload, notify }} />
    </div>
  )
}

export default ProductLayout
