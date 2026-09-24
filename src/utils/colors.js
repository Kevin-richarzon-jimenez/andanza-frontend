// El backend guarda el color como texto ("Negro"); el frontend decide con qué tono se pinta cada muestra.
export const COLOR_SWATCHES = [
  { label: 'Negro', hex: '#14151C' },
  { label: 'Café', hex: '#8B5E3C' },
  { label: 'Blanco', hex: '#FFFFFF', outline: true },
  { label: 'Verde', hex: '#2F855A' },
  { label: 'Azul', hex: '#5B3DF5' },
]

export function swatchFor(name) {
  return COLOR_SWATCHES.find((swatch) => swatch.label.toLowerCase() === name.toLowerCase())
    ?? { label: name, hex: '#B8B8C0', outline: true }
}
