import { Link } from 'react-router-dom'

// Los botones del panel, en un solo lugar: 'primary' es la acción principal de la pantalla (crear, guardar),
// 'secondary' las demás (editar, cancelar) y 'danger' lo que borra. Con `to` es un enlace de la aplicación, con
// `href` un enlace externo (como mailto:); sin ninguno, un botón.
const VARIANTS = {
  primary: 'btn btn-fill',
  secondary: 'btn btn-outline',
  danger: 'btn btn-outline btn-danger',
}

function Button({ variant = 'secondary', size = 'md', to, href, className = '', children, ...props }) {
  const classes = `${VARIANTS[variant]}${size === 'sm' ? ' btn-small' : ''}${className ? ` ${className}` : ''}`
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>
  if (href) return <a href={href} className={classes} {...props}>{children}</a>
  return <button type="button" className={classes} {...props}>{children}</button>
}

export default Button
