import { request } from './client.js'

// filters: { category, colors[], sizes[], minPrice, maxPrice, sort, search, page, size }
export function listProducts(filters = {}) {
  return request('/catalog/products', { query: filters })
}

export function getProduct(id) {
  return request(`/catalog/products/${id}`)
}

export function listCategories() {
  return request('/catalog/categories')
}

// { colors[], sizes[], minPrice, maxPrice }: lo que existe en el catálogo, para armar los filtros.
export function getFilterOptions() {
  return request('/catalog/filter-options')
}
