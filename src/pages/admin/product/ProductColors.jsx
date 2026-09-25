import { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { addVariant } from '../../../api/admin.js'
import Button from '../../../components/admin/Button.jsx'
import FormDialog from '../../../components/admin/FormDialog.jsx'
import { useFormDialog } from '../../../hooks/useFormDialog.js'
import { swatchFor } from '../../../utils/colors.js'
import { imagesOfColor } from '../../../utils/productImages.js'
import ColorPicker from './ColorPicker.jsx'
import SizePicker from './SizePicker.jsx'
import { Section } from './parts.jsx'
import { MAX_IMAGES_PER_COLOR, collectSizes, groupColors, sameColor } from './productData.js'

const EMPTY_FORM = { color: '', sizes: { sizes: [], others: '' } }

function colorPath(productId, color) {
  return `/admin/products/${productId}/colors/${encodeURIComponent(color)}`
}

// Pestaña Colores: un color por tarjeta. Al abrir uno se edita solo lo de ese color (sus fotos y sus tallas). El
// botón "+ Agregar color" abre el formulario en una ventana.
function ProductColors() {
  const { product, reload, notify } = useOutletContext()
  const navigate = useNavigate()
  const dialog = useFormDialog()
  const [form, setForm] = useState(EMPTY_FORM)
  const colors = groupColors(product)

  function openAdd() {
    setForm(EMPTY_FORM)
    dialog.open()
  }

  function handleSubmit() {
    dialog.submit(async () => {
      const name = form.color.trim()
      const chosen = collectSizes(form.sizes)
      if (!name) throw new Error('Elige o escribe el color.')
      if (product.variants.some((variant) => sameColor(variant.color, name))) {
        throw new Error(`El color ${name} ya existe: ábrelo para agregarle tallas.`)
      }
      if (chosen.length === 0) throw new Error('Elige al menos una talla para el color.')
      try {
        for (const size of chosen) {
          await addVariant(product.id, { color: name, size, stock: 0 })
        }
      } finally {
        reload()
      }
      navigate(colorPath(product.id, name))
      notify(`Se agregó el color ${name}. Ajusta el stock de sus tallas y sube sus fotos.`)
    })
  }

  return (
    <>
      <Section
        title="Colores del producto"
        description="Cada color tiene sus propias fotos y sus tallas con stock. Abre uno para editarlo."
        actions={<Button variant="primary" onClick={openAdd}>+ Agregar color</Button>}
      >
        <div className="color-grid">
          {colors.map((color) => {
            const photos = imagesOfColor(product, color.name)
            const swatch = swatchFor(color.name)
            return (
              <Link key={color.name} to={colorPath(product.id, color.name)} className="color-card" aria-label={`Editar el color ${color.name}`}>
                <span className="color-card-cover">
                  {photos[0] ? <img src={photos[0].thumbnailUrl} alt="" loading="lazy" /> : <span className="color-card-empty">Sin fotos</span>}
                </span>
                <span className="color-card-body">
                  <span className="color-card-name">
                    <span className="color-dot" style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }} aria-hidden="true" />
                    {color.name}
                  </span>
                  <span className="color-card-meta">{color.variants.length} {color.variants.length === 1 ? 'talla' : 'tallas'} · {color.stock === 0 ? 'agotado' : `${color.stock} unidades`}</span>
                  <span className={photos.length === 0 ? 'color-card-meta is-warning' : 'color-card-meta'}>{photos.length} de {MAX_IMAGES_PER_COLOR} fotos</span>
                </span>
              </Link>
            )
          })}
        </div>
      </Section>

      <FormDialog dialog={dialog} title="Agregar un color" description="Por ejemplo, para vender el mismo modelo en otro color. Empieza con las tallas que elijas, todas con stock 0." submitLabel="Agregar color" onSubmit={handleSubmit}>
        <ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} taken={colors.map((color) => color.name)} />
        <SizePicker legend="Tallas con las que arranca" value={form.sizes} onChange={(sizes) => setForm({ ...form, sizes })} />
      </FormDialog>
    </>
  )
}

export default ProductColors
