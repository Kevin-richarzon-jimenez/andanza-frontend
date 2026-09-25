import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Pagination from '../../components/Pagination.jsx'
import Select from '../../components/Select.jsx'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { useListParams } from '../../hooks/useListParams.js'
import { deleteProduct } from '../../api/admin.js'
import { listCategories, listProducts } from '../../api/catalog.js'
import PageHeader from '../../components/admin/PageHeader.jsx'
import RowActions from '../../components/admin/RowActions.jsx'
import { formatCOP } from '../../utils/formatCurrency.js'
import { coverImage } from '../../utils/productImages.js'
import './admin-shared.css'

const PAGE_SIZE = 10
const LOW_STOCK = 5

function stockSummary(product) {
  const total = product.variants.reduce((sum, variant) => sum + variant.stock, 0)
  const lowest = Math.min(...product.variants.map((variant) => variant.stock))
  const className = total === 0 ? 'stock-out' : lowest <= LOW_STOCK ? 'stock-low' : undefined
  return { total, className }
}

function Products() {
  const notice = useLocation().state?.notice
  const confirm = useConfirm()
  const { params, page, update, setPage } = useListParams()
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const [actionError, setActionError] = useState(null)

  const { data: categories } = useApiData(listCategories, 'admin:categories')
  const { data, error, reload } = useApiData(
    () => listProducts({ search, category, page, size: PAGE_SIZE }),
    `admin:products:${params}`,
  )

  const categoryOptions = [{ value: '', label: 'Todas' }, ...(categories ?? []).map((item) => ({ value: item.name, label: item.name }))]

  function handleSearch(event) {
    event.preventDefault()
    update({ search: new FormData(event.target).get('search').trim(), page: '' })
  }

  async function handleDelete(product) {
    const confirmed = await confirm({
      title: '¿Eliminar este producto?',
      message: `Se eliminará «${product.name}» con todas sus variantes, sus favoritos y sus comentarios. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return
    setActionError(null)
    try {
      await deleteProduct(product.id)
      if (data.content.length === 1 && page > 0) setPage(page - 1)
      else reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <>
      <PageHeader title="Productos" actions={[{ label: '+ Nuevo producto', to: '/admin/products/new' }]} />

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={handleSearch}>
          <input key={search} name="search" defaultValue={search} placeholder="Buscar por nombre o marca" aria-label="Buscar productos" />
          <button type="submit" className="btn btn-outline btn-small">Buscar</button>
        </form>
        <Select
          ariaLabel="Categoría"
          prefix="Categoría:"
          value={category}
          options={categoryOptions}
          onChange={(value) => update({ category: value, page: '' })}
        />
        {(search || category) && (
          <button type="button" className="clear-filters" style={{ width: 'auto', margin: 0 }} onClick={() => update({ search: '', category: '', page: '' })}>
            Limpiar filtros
          </button>
        )}
      </div>

      {actionError && <p className="form-error" role="alert">{actionError}</p>}
      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !data && <div className="admin-empty">Cargando productos...</div>}
      {!error && data && data.content.length === 0 && <div className="admin-empty">No hay productos con esos filtros.</div>}

      {!error && data && data.content.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="num">Precio</th>
                <th className="num">Stock</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((product) => {
                const { total, className } = stockSummary(product)
                const cover = coverImage(product)
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        {cover ? <img className="admin-thumb" src={cover.thumbnailUrl} alt="" loading="lazy" /> : <span className="admin-thumb is-empty" aria-hidden="true" />}
                        <div>
                          <Link className="strong" to={`/admin/products/${product.id}`}>{product.name}</Link>
                          <span className="muted">{product.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category.name}</td>
                    <td className="num">{formatCOP(product.price)}</td>
                    <td className="num">
                      <span className={className}>{total === 0 ? 'Agotado' : total}</span>
                      <span className="muted">{product.variants.length} {product.variants.length === 1 ? 'variante' : 'variantes'}</span>
                    </td>
                    <td>
                      <RowActions actions={[
                        { label: 'Editar', to: `/admin/products/${product.id}`, ariaLabel: `Editar ${product.name}` },
                        { label: 'Eliminar', variant: 'danger', onClick: () => handleDelete(product), ariaLabel: `Eliminar ${product.name}` },
                      ]} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </>
  )
}

export default Products
