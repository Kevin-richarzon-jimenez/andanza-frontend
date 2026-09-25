import { useState } from 'react'
import { useConfirm } from '../../confirm/useConfirm.js'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormDialog } from '../../hooks/useFormDialog.js'
import { createCategory, deleteCategory } from '../../api/admin.js'
import { listCategories } from '../../api/catalog.js'
import FormDialog from '../../components/admin/FormDialog.jsx'
import PageHeader from '../../components/admin/PageHeader.jsx'
import RowActions from '../../components/admin/RowActions.jsx'
import '../account-shared.css'
import './admin-shared.css'

const EMPTY_FORM = { name: '', description: '' }

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function Categories() {
  const confirm = useConfirm()
  const { data: categories, error, reload } = useApiData(listCategories, 'admin:categories')
  const dialog = useFormDialog()
  const [form, setForm] = useState(EMPTY_FORM)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState(null)

  function openCreate() {
    setForm(EMPTY_FORM)
    dialog.open()
  }

  function handleCreate() {
    dialog.submit(async () => {
      const created = await createCategory(form)
      setNotice(`La categoría «${created.name}» se creó correctamente.`)
      reload()
    })
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

  return (
    <>
      <PageHeader title="Categorías" actions={[{ label: '+ Nueva categoría', onClick: openCreate }]} />

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
                    <RowActions actions={[{ label: 'Eliminar', variant: 'danger', onClick: () => handleDelete(category), ariaLabel: `Eliminar la categoría ${category.name}` }]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormDialog dialog={dialog} title="Nueva categoría" description="Sirve para agrupar productos en la tienda." submitLabel="Crear categoría" onSubmit={handleCreate}>
        <div className="field-group">
          <label htmlFor="category-name">Nombre</label>
          <input id="category-name" required maxLength={40} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FieldError message={dialog.fields.name} />
        </div>
        <div className="field-group">
          <label htmlFor="category-description">Descripción</label>
          <textarea id="category-description" required maxLength={200} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <FieldError message={dialog.fields.description} />
        </div>
      </FormDialog>
    </>
  )
}

export default Categories
