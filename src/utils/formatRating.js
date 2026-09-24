export function formatRating(value) {
  return value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
