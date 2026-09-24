import { request } from './client.js'

export function listProductComments(productId) {
  return request('/comments', { query: { productId } })
}

export function listMyComments() {
  return request('/account/comments')
}

export function createComment({ productId, rating, text }) {
  return request('/comments', { method: 'POST', body: { productId, rating, text } })
}
