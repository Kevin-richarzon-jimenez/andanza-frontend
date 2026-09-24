import { request } from './client.js'

export function listAddresses() {
  return request('/account/addresses')
}

export function createAddress(address) {
  return request('/account/addresses', { method: 'POST', body: address })
}

export function updateAddress(id, address) {
  return request(`/account/addresses/${id}`, { method: 'PUT', body: address })
}

export function deleteAddress(id) {
  return request(`/account/addresses/${id}`, { method: 'DELETE' })
}
