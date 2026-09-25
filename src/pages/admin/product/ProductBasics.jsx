import Select from '../../../components/Select.jsx'
import { FieldError } from './parts.jsx'

// Los datos del "papá": nombre, marca, categoría, precio y descripción. Los usan la creación y la pestaña General.
function ProductBasics({ form, onChange, fields, categories, isNew }) {
  const categoryOptions = [
    ...(isNew ? [{ value: '', label: 'Elige una categoría' }] : []),
    ...categories.map((item) => ({ value: item.id, label: item.name })),
  ]

  return (
    <div className="pd-form">
      <div className="pd-fields">
        <div className="field-group">
          <label htmlFor="product-name">Nombre</label>
          <input id="product-name" required maxLength={100} value={form.name} onChange={(event) => onChange('name', event.target.value)} />
          <FieldError message={fields.name} />
        </div>
        <div className="field-group">
          <label htmlFor="product-brand">Marca</label>
          <input id="product-brand" required maxLength={60} value={form.brand} onChange={(event) => onChange('brand', event.target.value)} />
          <FieldError message={fields.brand} />
        </div>
        <div className="field-group">
          <label>Categoría</label>
          <Select ariaLabel="Categoría" value={form.categoryId} options={categoryOptions} onChange={(value) => onChange('categoryId', value)} />
          <FieldError message={fields.categoryId} />
        </div>
        <div className="field-group">
          <label htmlFor="product-price">Precio (COP)</label>
          <input id="product-price" type="number" min="1" step="1" required value={form.price} onChange={(event) => onChange('price', event.target.value)} />
          <FieldError message={fields.price} />
        </div>
        <div className="field-group pd-span-all">
          <label htmlFor="product-description">Descripción</label>
          <textarea id="product-description" required minLength={10} maxLength={1000} value={form.description} onChange={(event) => onChange('description', event.target.value)} />
          <FieldError message={fields.description} />
        </div>
      </div>
    </div>
  )
}

export default ProductBasics
