import { request } from './client.js'

// Todos estos endpoints exigen rol de administrador; el resto de la app no los usa.

export function createProduct(product) {
  return request('/admin/products', { method: 'POST', body: product })
}

export function updateProduct(id, product) {
  return request(`/admin/products/${id}`, { method: 'PUT', body: product })
}

export function deleteProduct(id) {
  return request(`/admin/products/${id}`, { method: 'DELETE' })
}

export function addVariant(productId, variant) {
  return request(`/admin/products/${productId}/variants`, { method: 'POST', body: variant })
}

export function updateStock(variantId, stock) {
  return request(`/admin/inventory/${variantId}`, { method: 'PUT', body: { stock } })
}

export function createCategory(category) {
  return request('/admin/categories', { method: 'POST', body: category })
}

export function deleteCategory(id) {
  return request(`/admin/categories/${id}`, { method: 'DELETE' })
}

// filters: { search, page, size }
export function listAdminUsers(filters = {}) {
  return request('/admin/users', { query: filters })
}

export function updateAdminUser(id, { role, accountStatus }) {
  return request(`/admin/users/${id}`, { method: 'PUT', body: { role, accountStatus } })
}

// filters: { status: 'PUBLISHED' | 'HIDDEN', page, size }
export function listAdminComments(filters = {}) {
  return request('/admin/comments', { query: filters })
}

export function setCommentVisibility(id, visible) {
  return request(`/admin/comments/${id}`, { method: 'PUT', body: { visible } })
}

export function listAdminMessages(filters = {}) {
  return request('/admin/contact-messages', { query: filters })
}

// Las imágenes de un producto van por color. `image` y `thumbnail` son Blob WebP ya reducidos (ver utils/imageResize.js).
export function uploadProductImage(productId, { color, image, thumbnail }) {
  const form = new FormData()
  form.append('image', image, 'image.webp')
  form.append('thumbnail', thumbnail, 'thumbnail.webp')
  return request(`/admin/products/${productId}/images`, { method: 'POST', query: { color }, body: form })
}

export function setProductImageCover(productId, imageId) {
  return request(`/admin/products/${productId}/images/${imageId}/cover`, { method: 'PUT' })
}

export function deleteProductImage(productId, imageId) {
  return request(`/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' })
}
