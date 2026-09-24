import { useState } from 'react'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { createCategory, deleteCategory } from '../../api/admin.js'
import { listCategories } from '../../api/catalog.js'
import { describeError } from '../../utils/formErrors.js'
import '../account-shared.css'
import './admin-shared.css'

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function Categories() {
  const confirm = useConfirm()
  const { data: categories, error, reload } = useApiData(listCategories, 'admin:categories')
  const [form, setForm] = useState({ name: '', description: '' })
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState(null)

  async function handleCreate(event) {
    event.preventDefault()
    setSaving(true)
    setFormError(null)
    setNotice('')
    try {
      const created = await createCategory(form)
      setForm({ name: '', description: '' })
      setNotice(`La categoría «${created.name}» se creó correctamente.`)
      reload()
    } catch (err) {
      setFormError(describeError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category) {
    const confirmed = await confirm({
      title: '¿Eliminar esta categoría?',
      message: `Se eliminará la categoría «${category.name}». Si tiene productos, no se podrá eliminar.`,
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return
    setActionError(null)
    setNotice('')
    try {
      await deleteCategory(category.id)
      reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const fields = formError?.fields ?? {}

  return (
    <>
      <div className="admin-header"><h1>Categorías</h1></div>

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {actionError && <p className="form-error" role="alert" style={{ marginTop: 0, marginBottom: 12 }}>{actionError}</p>}
      {error && (
        <div className="page-status" role="alert">
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!error && !categories && <div className="admin-empty">Cargando categorías...</div>}
      {categories && categories.length === 0 && <div className="admin-empty">Todavía no hay categorías.</div>}

      {categories && categories.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="strong">{category.name}</td>
                  <td className="text-cell">{category.description}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn btn-outline btn-small btn-danger" onClick={() => handleDelete(category)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="admin-section-title">Nueva categoría</h2>
      <form className="narrow-form admin-form" onSubmit={handleCreate}>
        <div className="field-group">
          <label htmlFor="category-name">Nombre</label>
          <input id="category-name" required maxLength={40} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FieldError message={fields.name} />
        </div>
        <div className="field-group">
          <label htmlFor="category-description">Descripción</label>
          <textarea id="category-description" required maxLength={200} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <FieldError message={fields.description} />
        </div>
        {formError && !Object.keys(fields).length && <p className="form-error" role="alert">{formError.message}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-fill" disabled={saving}>{saving ? 'Creando...' : 'Crear categoría'}</button>
        </div>
      </form>
    </>
  )
}

export default Categories
