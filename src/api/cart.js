import { request } from './client.js'

// items: [{ variantId, quantity }]
export function calculateTotals(items, discountCode) {
  return request('/cart/totals', { method: 'POST', body: { items, discountCode: discountCode || null } })
}
