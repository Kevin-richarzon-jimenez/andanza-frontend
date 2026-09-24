import { request } from './client.js'

export function listFavorites() {
  return request('/favorites', { redirectOnExpired: false })
}

export function addFavorite(productId) {
  return request(`/favorites/${productId}`, { method: 'PUT' })
}

export function removeFavorite(productId) {
  return request(`/favorites/${productId}`, { method: 'DELETE' })
}
