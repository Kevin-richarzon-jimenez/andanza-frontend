import PageHeader from '../../../components/admin/PageHeader.jsx'
import Button from '../../../components/admin/Button.jsx'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiData } from '../../../hooks/useApiData.js'
import { createProduct } from '../../../api/admin.js'
import { listCategories } from '../../../api/catalog.js'
import { describeError } from '../../../utils/formErrors.js'
import ProductBasics from './ProductBasics.jsx'
import ColorPicker from './ColorPicker.jsx'
import SizePicker from './SizePicker.jsx'
import { OtherErrors, Section } from './parts.jsx'
import { collectSizes } from './productData.js'
import '../admin-shared.css'
import './product.css'

// Crear un producto: primero sus datos y su primer color con sus tallas. Las fotos y los demás colores se agregan
// después, en la vista del producto.
function ProductNew() {
  const navigate = useNavigate()
  const { data: categories, error: categoriesError, reload } = useApiData(listCategories, 'admin:categories')
  const [form, setForm] = useState({ name: '', brand: '', categoryId: '', price: '', description: '' })
  const [color, setColor] = useState('')
  const [sizes, setSizes] = useState({ sizes: [], others: '' })
  const [stock, setStock] = useState('0')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  if (categoriesError) {
    return (
      <div className="page-status" role="alert">
        <p>{categoriesError.message}</p>
        <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
      </div>
    )
  }
  if (!categories) return <div className="admin-empty">Cargando...</div>

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.categoryId) {
      setError({ message: '', fields: { categoryId: 'Elige una categoría' } })
      return
    }
    const chosen = collectSizes(sizes)
    if (!color.trim()) {
      setError({ message: 'Elige o escribe el color del producto.', fields: {} })
      return
    }
    if (chosen.length === 0) {
      setError({ message: 'Elige al menos una talla.', fields: {} })
      return
    }
    setSaving(true)
    setError(null)
    try {
      const created = await createProduct({
        ...form,
        price: Number(form.price),
        variants: chosen.map((size) => ({ color: color.trim(), size, stock: Number(stock) })),
      })
      navigate(`/admin/products/${created.id}/colors`, { state: { notice: `«${created.name}» se creó correctamente. Abre cada color para subir sus fotos.` } })
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pd-page">
      <Link to="/admin/products" className="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Productos
      </Link>
      <PageHeader title="Nuevo producto" />

      <form className="pd-stack" onSubmit={handleSubmit}>
        <Section title="Datos del producto" description="Lo que comparten todos sus colores y tallas.">
          <div className="admin-form is-plain">
            <ProductBasics form={form} onChange={setField} fields={error?.fields ?? {}} categories={categories} isNew />
          </div>
        </Section>

        <Section title="Primer color y sus tallas" description="El color y las tallas con las que sale a la venta. Los demás colores, las fotos y el stock de cada talla se ajustan después, en la vista del producto.">
          <div className="pd-stack">
            <ColorPicker value={color} onChange={setColor} />
            <SizePicker legend="Tallas" value={sizes} onChange={setSizes} />
            <div className="field-group size-stock">
              <label htmlFor="new-stock">Stock inicial de cada talla</label>
              <input id="new-stock" type="number" min="0" step="1" required value={stock} onChange={(event) => setStock(event.target.value)} />
            </div>
          </div>
        </Section>

        {error && <OtherErrors error={error} />}
        <div className="form-actions">
          <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear producto'}</Button>
          <Button to="/admin/products">Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ProductNew
