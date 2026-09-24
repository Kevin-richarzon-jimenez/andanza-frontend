import { request } from './client.js'

export function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export function register({ firstName, lastName, email, password, confirmPassword }) {
  return request('/auth/register', {
    method: 'POST',
    body: { firstName, lastName, email, password, confirmPassword },
  })
}

export function changePassword({ currentPassword, newPassword, confirmNewPassword }) {
  return request('/auth/password', {
    method: 'PUT',
    body: { currentPassword, newPassword, confirmNewPassword },
  })
}
