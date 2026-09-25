import Button from './Button.jsx'
import './admin-ui.css'

// El encabezado de toda pantalla del panel: el título a la izquierda y, a la derecha, sus acciones (la principal es
// la de crear). actions: [{ key, label, to | onClick, variant }]
function PageHeader({ title, description, actions = [] }) {
  return (
    <>
      <div className="admin-header">
        <h1>{title}</h1>
        {actions.length > 0 && (
          <div className="admin-header-actions">
            {actions.map(({ key, label, variant = 'primary', ...props }) => (
              <Button key={key ?? label} variant={variant} {...props}>{label}</Button>
            ))}
          </div>
        )}
      </div>
      {description && <p className="admin-subtitle">{description}</p>}
    </>
  )
}

export default PageHeader
