import { useState } from 'react'
import { COLOR_SWATCHES, swatchFor } from '../../../utils/colors.js'
import { sameColor } from './productData.js'

// Elegir el color de un producto: fichas con el tono a la vista (las de los colores que el producto ya tiene no se
// ofrecen) y un campo para escribir otro. Reemplaza al desplegable nativo del navegador, que no se puede estilar.
function ColorPicker({ value, onChange, taken = [] }) {
  const [other, setOther] = useState('')
  const options = COLOR_SWATCHES.filter((swatch) => !taken.some((color) => sameColor(color, swatch.label)))

  function choose(label) {
    setOther('')
    onChange(label)
  }

  function type(text) {
    setOther(text)
    onChange(text)
  }

  return (
    <fieldset className="picker">
      <legend>Color</legend>
      <div className="color-chips">
        {options.map((swatch) => {
          const selected = other === '' && sameColor(value, swatch.label)
          return (
            <button key={swatch.label} type="button" className={selected ? 'color-chip selected' : 'color-chip'} aria-pressed={selected} onClick={() => choose(swatch.label)}>
              <span className="color-dot" style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }} aria-hidden="true" />
              {swatch.label}
            </button>
          )
        })}
      </div>
      <div className="field-group picker-other">
        <label htmlFor="other-color">Otro color</label>
        <input id="other-color" maxLength={40} value={other} placeholder="Ej. Vino tinto" onChange={(event) => type(event.target.value)} />
      </div>
      {value.trim() !== '' && (
        <p className="picker-summary">
          Color elegido: <span className="color-dot" style={{ background: swatchFor(value).hex, border: swatchFor(value).outline ? '1px solid #ddd' : undefined }} aria-hidden="true" /> <strong>{value.trim()}</strong>
        </p>
      )}
    </fieldset>
  )
}

export default ColorPicker
