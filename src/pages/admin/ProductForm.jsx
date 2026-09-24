import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import Select from '../../components/Select.jsx'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { addVariant, createProduct, deleteProduct, updateProduct, updateStock } from '../../api/admin.js'
import { getProduct, listCategories } from '../../api/catalog.js'
import { COLOR_SWATCHES } from '../../utils/colors.js'
import { describeError } from '../../utils/formErrors.js'
import '../account-shared.css'
import './admin-shared.css'

const MAIN_FIELDS = ['name', 'brand', 'categoryId', 'price', 'description']
const EMPTY_VARIANT = { color: '', size: '', stock: '0' }

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function ColorSuggestions() {
  return (
    <datalist id="color-suggestions">
      {COLOR_SWATCHES.map((swatch) => <option key={swatch.label} value={swatch.label} />)}
    </datalist>
  )
}

// Errores que no pertenecen a un campo del formulario (por ejemplo, los de una variante). Una regla de
// negocio llega con el mismo texto como mensaje general y como error de campo: se muestra una sola vez.
function OtherErrors({ error }) {
  const others = Object.entries(error.fields).filter(([field, message]) => !MAIN_FIELDS.includes(field) && message !== error.message)
  return (
    <>
      {error.message && <p className="form-error" role="alert">{error.message}</p>}
      {others.map(([field, message]) => <div className="field-error" role="alert" key={field}>{message}</div>)}
    </>
  )
}

function StockRow({ variant, onSaved }) {
  const [stock, setStock] = useState(String(variant.stock))
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const changed = stock !== '' && Number(stock) !== variant.stock

  async function save() {
    setStatus({ type: 'saving', message: '' })
    try {
      await updateStock(variant.id, Number(stock))
      setStatus({ type: 'saved', message: 'Guardado' })
      onSaved()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  return (
    <tr>
      <td>{variant.color}</td>
      <td>{variant.size}</td>
      <td>
        <input
          className="stock-input"
          type="number"
          min="0"
          step="1"
          value={stock}
          aria-label={`Stock de ${variant.color} talla ${variant.size}`}
          onChange={(event) => { setStock(event.target.value); setStatus({ type: 'idle', message: '' }) }}
        />
      </td>
      <td>
        <div className="admin-actions">
          {status.type === 'saved' && !changed && <span className="form-feedback" style={{ margin: 0 }} role="status">{status.message}</span>}
          {status.type === 'error' && <span className="form-error" style={{ margin: 0 }} role="alert">{status.message}</span>}
          <button type="button" className="btn btn-outline btn-small" disabled={!changed || status.type === 'saving'} onClick={save}>
            {status.type === 'saving' ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </td>
    </tr>
  )
}

function AddVariantForm({ productId, onAdded }) {
  const [form, setForm] = useState(EMPTY_VARIANT)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await addVariant(productId, { color: form.color, size: form.size, stock: Number(form.stock) })
      setForm(EMPTY_VARIANT)
      onAdded()
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="variant-row">
        <div className="field-group">
          <label htmlFor="new-variant-color">Color</label>
          <input id="new-variant-color" list="color-suggestions" required maxLength={40} value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
        </div>
        <div className="field-group">
          <label htmlFor="new-variant-size">Talla</label>
          <input id="new-variant-size" required maxLength={10} value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} />
        </div>
        <div className="field-group">
          <label htmlFor="new-variant-stock">Stock</label>
          <input id="new-variant-stock" type="number" min="0" step="1" required value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
        </div>
        <button type="submit" className="btn btn-outline" disabled={saving}>{saving ? 'Agregando...' : 'Agregar variante'}</button>
      </div>
      {error && <OtherErrors error={error} />}
      <ColorSuggestions />
    </form>
  )
}

function ProductFields({ categories, product, onChanged }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [form, setForm] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    categoryId: product?.category.id ?? '',
    price: product ? String(Math.round(Number(product.price))) : '',
    description: product?.description ?? '',
  })
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const categoryOptions = [
    ...(product ? [] : [{ value: '', label: 'Elige una categoría' }]),
    ...categories.map((item) => ({ value: item.id, label: item.name })),
  ]

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function updateVariant(index, field, value) {
    setVariants((current) => current.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.categoryId) {
      setError({ message: '', fields: { categoryId: 'Elige una categoría' } })
      return
    }
    setSaving(true)
    setError(null)
    setNotice('')
    const body = { name: form.name, brand: form.brand, categoryId: form.categoryId, price: Number(form.price), description: form.description }
    try {
      if (product) {
        await updateProduct(product.id, body)
        setNotice('Cambios guardados')
        setTimeout(() => setNotice(''), 4000)
        onChanged()
      } else {
        const created = await createProduct({
          ...body,
          variants: variants.map((variant) => ({ color: variant.color, size: variant.size, stock: Number(variant.stock) })),
        })
        navigate('/admin/products', { state: { notice: `«${created.name}» se creó correctamente.` } })
      }
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const confirmed = await confirm({
      title: '¿Eliminar este producto?',
      message: `Se eliminará «${product.name}» con todas sus variantes, sus favoritos y sus comentarios. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return
    try {
      await deleteProduct(product.id)
      navigate('/admin/products', { state: { notice: `«${product.name}» se eliminó.` } })
    } catch (err) {
      setError({ message: err.message, fields: {} })
    }
  }

  const fields = error?.fields ?? {}

  return (
    <>
      <Link to="/admin/products" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Volver a productos
      </Link>
      <div className="admin-header" style={{ marginTop: 12 }}>
        <h1>{product ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <form className="narrow-form admin-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field-group">
            <label htmlFor="product-name">Nombre</label>
            <input id="product-name" required maxLength={100} value={form.name} onChange={(event) => setField('name', event.target.value)} />
            <FieldError message={fields.name} />
          </div>
          <div className="field-group">
            <label htmlFor="product-brand">Marca</label>
            <input id="product-brand" required maxLength={60} value={form.brand} onChange={(event) => setField('brand', event.target.value)} />
            <FieldError message={fields.brand} />
          </div>
        </div>

        <div className="field-grid">
          <div className="field-group">
            <label>Categoría</label>
            <Select ariaLabel="Categoría" value={form.categoryId} options={categoryOptions} onChange={(value) => setField('categoryId', value)} />
            <FieldError message={fields.categoryId} />
          </div>
          <div className="field-group">
            <label htmlFor="product-price">Precio (COP)</label>
            <input id="product-price" type="number" min="1" step="1" required value={form.price} onChange={(event) => setField('price', event.target.value)} />
            <FieldError message={fields.price} />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="product-description">Descripción</label>
          <textarea id="product-description" required minLength={10} maxLength={1000} value={form.description} onChange={(event) => setField('description', event.target.value)} />
          <FieldError message={fields.description} />
        </div>

        {!product && (
          <>
            <h2 className="admin-section-title">Variantes</h2>
            <p className="admin-subtitle" style={{ margin: '-6px 0 14px' }}>Cada combinación de color y talla tiene su propio stock. Puedes agregar más después.</p>
            {variants.map((variant, index) => (
              <div className="variant-row" key={index}>
                <div className="field-group">
                  <label htmlFor={`variant-color-${index}`}>Color</label>
                  <input id={`variant-color-${index}`} list="color-suggestions" required maxLength={40} value={variant.color} onChange={(event) => updateVariant(index, 'color', event.target.value)} />
                </div>
                <div className="field-group">
                  <label htmlFor={`variant-size-${index}`}>Talla</label>
                  <input id={`variant-size-${index}`} required maxLength={10} value={variant.size} onChange={(event) => updateVariant(index, 'size', event.target.value)} />
                </div>
                <div className="field-group">
                  <label htmlFor={`variant-stock-${index}`}>Stock</label>
                  <input id={`variant-stock-${index}`} type="number" min="0" step="1" required value={variant.stock} onChange={(event) => updateVariant(index, 'stock', event.target.value)} />
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  disabled={variants.length === 1}
                  aria-label={`Quitar la variante ${index + 1}`}
                  onClick={() => setVariants((current) => current.filter((_, i) => i !== index))}
                >
                  Quitar
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-small" onClick={() => setVariants((current) => [...current, { ...EMPTY_VARIANT }])}>
              + Agregar otra variante
            </button>
            <ColorSuggestions />
          </>
        )}

        {error && <OtherErrors error={error} />}

        <div className="form-actions">
          <button type="submit" className="btn btn-fill" disabled={saving}>
            {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link to="/admin/products" className="btn btn-outline">Cancelar</Link>
        </div>
      </form>

      {product && (
        <>
          <h2 className="admin-section-title">Variantes y stock</h2>
          <div className="admin-table-wrap" style={{ maxWidth: 640 }}>
            <table className="admin-table">
              <thead>
                <tr><th>Color</th><th>Talla</th><th>Stock</th><th><span className="sr-only">Acciones</span></th></tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => <StockRow key={variant.id} variant={variant} onSaved={onChanged} />)}
              </tbody>
            </table>
          </div>

          <h2 className="admin-section-title">Agregar variante</h2>
          <div style={{ maxWidth: 640 }}>
            <AddVariantForm productId={product.id} onAdded={onChanged} />
          </div>

          <h2 className="admin-section-title">Eliminar producto</h2>
          <p className="admin-subtitle" style={{ margin: '-6px 0 14px' }}>Se borran también sus variantes, favoritos y comentarios.</p>
          <button type="button" className="btn btn-outline btn-danger" onClick={handleDelete}>Eliminar producto</button>
        </>
      )}
    </>
  )
}

function NewProduct() {
  const { data: categories, error, reload } = useApiData(listCategories, 'admin:categories')

  if (error) {
    return (
      <div className="page-status" role="alert">
        <p>{error.message}</p>
        <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
      </div>
    )
  }
  if (!categories) return <div className="admin-empty">Cargando...</div>
  return <ProductFields categories={categories} product={null} onChanged={() => {}} />
}

function EditProduct({ id }) {
  const { data: categories, error: categoriesError, reload: reloadCategories } = useApiData(listCategories, 'admin:categories')
  const { data: product, error: productError, reload } = useApiData(() => getProduct(id), `admin:product:${id}`)

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
  return <ProductFields categories={categories} product={product} onChanged={reload} />
}

function ProductForm() {
  const { id } = useParams()
  return id ? <EditProduct key={id} id={id} /> : <NewProduct />
}

export default ProductForm
