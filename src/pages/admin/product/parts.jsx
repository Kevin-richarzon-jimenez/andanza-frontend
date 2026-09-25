import { MAIN_FIELDS } from './productData.js'

export function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

// Errores que no pertenecen a un campo del formulario (por ejemplo, los de una variante). Una regla de
// negocio llega con el mismo texto como mensaje general y como error de campo: se muestra una sola vez.
export function OtherErrors({ error }) {
  const others = Object.entries(error.fields).filter(([field, message]) => !MAIN_FIELDS.includes(field) && message !== error.message)
  return (
    <>
      {error.message && <p className="form-error" role="alert">{error.message}</p>}
      {others.map(([field, message]) => <div className="field-error" role="alert" key={field}>{message}</div>)}
    </>
  )
}

// Una tarjeta del producto: título, descripción y, a la derecha, sus acciones (por ejemplo, "+ Agregar talla").
export function Section({ title, description, actions, children, tone }) {
  return (
    <section className={tone === 'danger' ? 'pd-section is-danger' : 'pd-section'}>
      <div className="pd-section-head">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="pd-section-actions">{actions}</div>}
      </div>
      {children}
    </section>
  )
}
