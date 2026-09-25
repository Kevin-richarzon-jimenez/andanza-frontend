import { Link } from 'react-router-dom'
import { useApiData } from '../../hooks/useApiData.js'
import { listCategories, listProducts } from '../../api/catalog.js'
import { listAdminComments, listAdminMessages, listAdminUsers } from '../../api/admin.js'
import PageHeader from '../../components/admin/PageHeader.jsx'
import './admin-shared.css'

const LOW_STOCK = 5
const LOW_STOCK_ROWS = 8

function Dashboard() {
  const products = useApiData(() => listProducts({ size: 100 }), 'admin:dashboard:products')
  const categories = useApiData(listCategories, 'admin:dashboard:categories')
  const users = useApiData(() => listAdminUsers({ size: 1 }), 'admin:dashboard:users')
  const comments = useApiData(() => listAdminComments({ size: 1 }), 'admin:dashboard:comments')
  const hiddenComments = useApiData(() => listAdminComments({ status: 'HIDDEN', size: 1 }), 'admin:dashboard:hidden')
  const messages = useApiData(() => listAdminMessages({ size: 1 }), 'admin:dashboard:messages')

  const all = [products, categories, users, comments, hiddenComments, messages]
  const failed = all.find((item) => item.error)

  const cards = [
    { label: 'Productos', value: products.data?.totalElements, to: '/admin/products' },
    { label: 'Categorías', value: categories.data?.length, to: '/admin/categories' },
    { label: 'Usuarios', value: users.data?.totalElements, to: '/admin/users' },
    {
      label: 'Comentarios',
      value: comments.data?.totalElements,
      note: hiddenComments.data ? `${hiddenComments.data.totalElements} oculto(s)` : null,
      to: '/admin/comments',
    },
    { label: 'Mensajes de contacto', value: messages.data?.totalElements, to: '/admin/messages' },
  ]

  const lowStock = (products.data?.content ?? [])
    .flatMap((product) => product.variants.filter((variant) => variant.stock <= LOW_STOCK).map((variant) => ({ product, variant })))
    .sort((a, b) => a.variant.stock - b.variant.stock)
  const partial = (products.data?.totalElements ?? 0) > (products.data?.content.length ?? 0)

  return (
    <>
      <PageHeader title="Resumen" />

      {failed && (
        <div className="page-status" role="alert">
          <p>{failed.error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={() => all.forEach((item) => item.reload())}>Reintentar</button>
        </div>
      )}

      <div className="admin-cards">
        {cards.map((card) => (
          <Link className="admin-card" to={card.to} key={card.label}>
            <div className="admin-card-value">{card.value ?? '—'}</div>
            <div className="admin-card-label">{card.label}</div>
            {card.note && <div className="admin-card-note">{card.note}</div>}
          </Link>
        ))}
      </div>

      <h2 className="admin-section-title">Stock bajo</h2>
      {!products.data && !failed && <div className="admin-empty">Cargando...</div>}
      {products.data && lowStock.length === 0 && (
        <div className="admin-empty">Ninguna variante tiene {LOW_STOCK} unidades o menos.</div>
      )}
      {lowStock.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Producto</th><th>Variante</th><th className="num">Stock</th></tr>
            </thead>
            <tbody>
              {lowStock.slice(0, LOW_STOCK_ROWS).map(({ product, variant }) => (
                <tr key={variant.id}>
                  <td><Link className="strong" to={`/admin/products/${product.id}/edit`}>{product.name}</Link></td>
                  <td>Talla {variant.size} · {variant.color}</td>
                  <td className={variant.stock === 0 ? 'num stock-out' : 'num stock-low'}>{variant.stock === 0 ? 'Agotado' : variant.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {lowStock.length > LOW_STOCK_ROWS && (
        <p className="admin-subtitle" style={{ marginTop: 10 }}>
          Se muestran {LOW_STOCK_ROWS} de {lowStock.length}. Revisa el resto en <Link to="/admin/products">Productos</Link>.
        </p>
      )}
      {partial && (
        <p className="admin-subtitle" style={{ marginTop: 10 }}>
          Este resumen revisa los primeros {products.data.content.length} productos.
        </p>
      )}
    </>
  )
}

export default Dashboard
