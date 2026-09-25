import { Link, useOutletContext, useParams } from 'react-router-dom'
import EmptyState from '../../../components/EmptyState.jsx'
import { swatchFor } from '../../../utils/colors.js'
import ColorGallery from './ColorGallery.jsx'
import SizesStock from './SizesStock.jsx'
import { Section } from './parts.jsx'
import { sameColor } from './productData.js'

// La vista de un color: solo lo que tiene que ver con él (sus fotos y sus tallas con stock).
function ProductColor() {
  const { color: colorParam } = useParams()
  const { product, reload, notify } = useOutletContext()
  const variants = product.variants.filter((variant) => sameColor(variant.color, colorParam))
  const backHref = `/admin/products/${product.id}/colors`

  if (variants.length === 0) {
    return (
      <EmptyState
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        )}
        title="Este producto no tiene ese color"
        text="Puede que el enlace sea incorrecto."
        ctaText="Ver los colores del producto"
        ctaHref={backHref}
      />
    )
  }

  const color = variants[0].color
  const swatch = swatchFor(color)
  const stock = variants.reduce((sum, variant) => sum + variant.stock, 0)

  return (
    <>
      <div className="color-head">
        <Link to={backHref} className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Colores
        </Link>
        <h2 className="color-title">
          <span className="color-dot is-large" style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }} aria-hidden="true" />
          {color}
        </h2>
        <span className="color-summary">{variants.length} {variants.length === 1 ? 'talla' : 'tallas'} · {stock === 0 ? 'agotado' : `${stock} unidades`}</span>
      </div>

      <Section title={`Fotos de ${color}`} description="La primera es la portada. Las tallas de este color comparten estas fotos. Conviene que el zapato quede centrado: las tarjetas recortan la foto en cuadrado.">
        <ColorGallery product={product} color={color} onChanged={reload} />
      </Section>

      <SizesStock product={product} color={color} variants={variants} onChanged={reload} notify={notify} />
    </>
  )
}

export default ProductColor
