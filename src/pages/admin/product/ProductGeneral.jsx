import Button from '../../../components/admin/Button.jsx'
import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useConfirm } from '../../../confirm/useConfirm.js'
import { deleteProduct, updateProduct } from '../../../api/admin.js'
import { describeError } from '../../../utils/formErrors.js'
import ProductBasics from './ProductBasics.jsx'
import { OtherErrors, Section } from './parts.jsx'

// Pestaña General: los datos del producto ("el papá") y, al final, eliminarlo.
function ProductGeneral() {
  const { product, categories, reload, notify } = useOutletContext()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    categoryId: product.category.id,
    price: String(Math.round(Number(product.price))),
    description: product.description,
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateProduct(product.id, { ...form, price: Number(form.price) })
      notify('Cambios guardados')
      reload()
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const confirmed = await confirm({
      title: '¿Eliminar este producto?',
      message: `Se eliminará «${product.name}» con todas sus variantes, sus fotos, sus favoritos y sus comentarios. Esta acción no se puede deshacer.`,
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

  return (
    <>
      <Section title="Datos del producto" description="Lo que comparten todos sus colores y tallas.">
        <form className="admin-form is-plain" onSubmit={handleSubmit}>
          <ProductBasics form={form} onChange={setField} fields={error?.fields ?? {}} categories={categories} isNew={false} />
          {error && <OtherErrors error={error} />}
          <div className="form-actions">
            <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
          </div>
        </form>
      </Section>

      <Section title="Eliminar producto" description="Se borran también sus variantes, sus fotos, sus favoritos y sus comentarios." tone="danger">
        <Button variant="danger" onClick={handleDelete}>Eliminar producto</Button>
      </Section>
    </>
  )
}

export default ProductGeneral
