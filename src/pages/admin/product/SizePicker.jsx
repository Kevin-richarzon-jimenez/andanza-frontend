import { SIZE_OPTIONS } from './productData.js'

// Elegir tallas: fichas de la 35 a la 46 (las que ya existen no se ofrecen) y un campo para otras tallas.
// value: { sizes: string[], others: string }
function SizePicker({ value, onChange, taken = [], legend = 'Tallas' }) {
  const options = SIZE_OPTIONS.filter((size) => !taken.includes(size))

  function toggle(size) {
    const sizes = value.sizes.includes(size) ? value.sizes.filter((item) => item !== size) : [...value.sizes, size]
    onChange({ ...value, sizes })
  }

  return (
    <fieldset className="picker">
      <legend>{legend}</legend>
      <div className="size-chips">
        {options.map((size) => (
          <button key={size} type="button" className={value.sizes.includes(size) ? 'pill selected' : 'pill'} aria-pressed={value.sizes.includes(size)} onClick={() => toggle(size)}>{size}</button>
        ))}
      </div>
      <div className="field-group picker-other">
        <label htmlFor="other-sizes">Otras tallas (separadas por coma)</label>
        <input id="other-sizes" maxLength={60} value={value.others} placeholder="Ej. 37.5, 47" onChange={(event) => onChange({ ...value, others: event.target.value })} />
      </div>
    </fieldset>
  )
}

export default SizePicker
