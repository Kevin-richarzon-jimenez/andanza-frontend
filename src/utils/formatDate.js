export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}
