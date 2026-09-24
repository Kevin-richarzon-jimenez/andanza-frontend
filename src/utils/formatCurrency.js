export function formatCOP(amount) {
  const value = Number(amount)
  const decimals = Number.isInteger(value) ? 0 : 2
  return '$' + value.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
