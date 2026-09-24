import { request } from './client.js'

export function sendContactMessage({ name, email, subject, message }) {
  return request('/contact-messages', { method: 'POST', body: { name, email, subject, message } })
}

export function subscribeToNewsletter(email) {
  return request('/newsletter-subscriptions', { method: 'POST', body: { email } })
}
