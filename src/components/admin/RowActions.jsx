import Button from './Button.jsx'

// Las acciones de una fila de una tabla, siempre iguales y en el mismo orden: Editar primero, Eliminar al final.
// actions: [{ key, label, to | onClick, variant, ariaLabel }]
function RowActions({ actions }) {
  return (
    <div className="admin-actions">
      {actions.map(({ key, label, variant = 'secondary', ariaLabel, ...props }) => (
        <Button key={key ?? label} variant={variant} size="sm" aria-label={ariaLabel} {...props}>{label}</Button>
      ))}
    </div>
  )
}

export default RowActions
