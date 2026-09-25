import { useState } from 'react'
import { addVariant, updateStock } from '../../../api/admin.js'
import Button from '../../../components/admin/Button.jsx'
import FormDialog from '../../../components/admin/FormDialog.jsx'
import RowActions from '../../../components/admin/RowActions.jsx'
import { useFormDialog } from '../../../hooks/useFormDialog.js'
import SizePicker from './SizePicker.jsx'
import { FieldError, Section } from './parts.jsx'
import { collectSizes } from './productData.js'

// La sección "Tallas y stock" de un color: una tabla de solo lectura y, para crear o editar, ventanas aparte.
// "+ Agregar talla" está en el encabezado de la sección y cada fila tiene su "Editar".
function SizesStock({ product, color, variants, onChanged, notify }) {
  const addDialog = useFormDialog()
  const editDialog = useFormDialog()
  const [sizes, setSizes] = useState({ sizes: [], others: '' })
  const [stock, setStock] = useState('0')

  function openAdd() {
    setSizes({ sizes: [], others: '' })
    setStock('0')
    addDialog.open()
  }

  function openEdit(variant) {
    setStock(String(variant.stock))
    editDialog.open(variant)
  }

  function handleAdd() {
    addDialog.submit(async () => {
      const chosen = collectSizes(sizes)
      if (chosen.length === 0) throw new Error('Elige al menos una talla.')
      try {
        for (const size of chosen) {
          await addVariant(product.id, { color, size, stock: Number(stock) })
        }
      } finally {
        onChanged()
      }
      notify(chosen.length === 1 ? `Se agregó la talla ${chosen[0]} a ${color}.` : `Se agregaron las tallas ${chosen.join(', ')} a ${color}.`)
    })
  }

  function handleEdit() {
    const variant = editDialog.data
    editDialog.submit(async () => {
      await updateStock(variant.id, Number(stock))
      onChanged()
      notify(`Stock de ${color} talla ${variant.size} actualizado.`)
    })
  }

  return (
    <>
      <Section
        title={`Tallas y stock de ${color}`}
        description="Las unidades que hay de cada talla."
        actions={<Button variant="primary" onClick={openAdd}>+ Agregar tallas</Button>}
      >
        <div className="admin-table-wrap sizes-table">
          <table className="admin-table">
            <thead>
              <tr><th>Talla</th><th className="num">Stock</th><th><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td className="strong">{variant.size}</td>
                  <td className="num">
                    <span className={variant.stock === 0 ? 'stock-out' : variant.stock <= 5 ? 'stock-low' : undefined}>{variant.stock === 0 ? 'Agotado' : variant.stock}</span>
                  </td>
                  <td>
                    <RowActions actions={[{ label: 'Editar', ariaLabel: `Editar la talla ${variant.size} de ${color}`, onClick: () => openEdit(variant) }]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <FormDialog dialog={addDialog} title={`Agregar tallas a ${color}`} description="Elige las tallas que faltan; todas empiezan con el mismo stock." submitLabel="Agregar tallas" onSubmit={handleAdd}>
        <SizePicker legend="Tallas" value={sizes} onChange={setSizes} taken={variants.map((variant) => variant.size)} />
        <div className="field-group">
          <label htmlFor="new-size-stock">Stock inicial de cada talla</label>
          <input id="new-size-stock" type="number" min="0" step="1" required value={stock} onChange={(event) => setStock(event.target.value)} />
          <FieldError message={addDialog.fields.stock} />
        </div>
      </FormDialog>

      <FormDialog dialog={editDialog} title={`Editar la talla ${editDialog.data?.size ?? ''} de ${color}`} description="La talla no se puede cambiar; sí las unidades que hay." submitLabel="Guardar stock" onSubmit={handleEdit}>
        <div className="field-group">
          <label htmlFor="edit-stock">Stock</label>
          <input id="edit-stock" type="number" min="0" step="1" required value={stock} onChange={(event) => setStock(event.target.value)} />
          <FieldError message={editDialog.fields.stock} />
        </div>
      </FormDialog>
    </>
  )
}

export default SizesStock
