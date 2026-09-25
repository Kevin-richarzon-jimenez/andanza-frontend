// El backend guarda el color como texto ("Negro"); el frontend decide con qué tono se pinta cada muestra.
export const COLOR_SWATCHES = [
  { label: 'Negro', hex: '#14151C' },
  { label: 'Blanco', hex: '#FFFFFF', outline: true },
  { label: 'Gris', hex: '#8A8D99' },
  { label: 'Café', hex: '#8B5E3C' },
  { label: 'Beige', hex: '#D9C3A0', outline: true },
  { label: 'Rojo', hex: '#D93A2B' },
  { label: 'Rosado', hex: '#F2A7C3' },
  { label: 'Naranja', hex: '#F28C28' },
  { label: 'Amarillo', hex: '#F2C230' },
  { label: 'Verde', hex: '#2F855A' },
  { label: 'Azul', hex: '#5B3DF5' },
  { label: 'Morado', hex: '#7B4FBF' },
]

export function swatchFor(name) {
  return COLOR_SWATCHES.find((swatch) => swatch.label.toLowerCase() === name.toLowerCase())
    ?? { label: name, hex: '#B8B8C0', outline: true }
}
