import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import './admin-ui.css'

// Ventana con el formulario de crear o editar algo. Las listas y las secciones solo tienen el botón que la abre; el
// formulario nunca va pegado debajo de una tabla. Se maneja con useFormDialog:
//   <FormDialog dialog={dialog} title="Nueva categoría" submitLabel="Crear" onSubmit={...}>campos...</FormDialog>
// Los campos solo existen mientras la ventana está abierta, así que cada vez que se abre empiezan limpios.
function FormDialog({ dialog, title, description, submitLabel = 'Guardar', onSubmit, children }) {
  const ref = useRef(null)
  const titleId = useId()
  const { isOpen, saving, error, close } = dialog

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (isOpen && !element.open) {
      element.showModal()
      element.querySelector('input:not([type="hidden"]), select, textarea')?.focus()
    } else if (!isOpen && element.open) {
      element.close()
    }
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <dialog
      ref={ref}
      className="form-dialog"
      aria-labelledby={titleId}
      onClose={close}
      onClick={(event) => { if (event.target === event.currentTarget) close() }}
    >
      {isOpen && (
        <form className="form-dialog-body" onSubmit={handleSubmit}>
          <header className="form-dialog-head">
            <div>
              <h2 id={titleId}>{title}</h2>
              {description && <p>{description}</p>}
            </div>
            <button type="button" className="form-dialog-close" aria-label="Cerrar" onClick={close}>×</button>
          </header>

          <div className="form-dialog-fields">
            {children}
            {error?.message && <p className="form-error" role="alert">{error.message}</p>}
          </div>

          <footer className="form-dialog-foot">
            <Button onClick={close}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : submitLabel}</Button>
          </footer>
        </form>
      )}
    </dialog>
  )
}

export default FormDialog
