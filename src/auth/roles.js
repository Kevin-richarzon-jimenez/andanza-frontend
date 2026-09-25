// Quién es personal interno (entra al panel de gestión) y cómo se llama cada rol. Solo decide qué mostrar:
// la seguridad real está en el backend.
const STAFF_ROLES = ['ADMIN']

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  CUSTOMER: 'Cliente',
}

export function isStaff(user) {
  return STAFF_ROLES.includes(user?.role)
}

export function roleLabel(user) {
  return ROLE_LABELS[user?.role] ?? 'Cuenta'
}

export function initialsOf(user) {
  const letters = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()
  return letters || '?'
}
