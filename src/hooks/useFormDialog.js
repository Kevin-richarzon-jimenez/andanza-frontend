import { useCallback, useState } from 'react'
import { describeError } from '../utils/formErrors.js'

// Estado de una ventana de formulario (FormDialog): abrir (con el elemento que se edita, si lo hay), guardar y
// cerrar. `submit` recibe lo que hay que hacer al guardar: si sale bien, cierra la ventana; si falla, deja abierta
// y muestra el error del servidor (el general en `error.message` y los de cada campo en `error.fields`).
export function useFormDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const open = useCallback((item = null) => {
    setError(null)
    setData(item)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const submit = useCallback(async (action) => {
    setSaving(true)
    setError(null)
    try {
      await action()
      setIsOpen(false)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setSaving(false)
    }
  }, [])

  return { isOpen, data, saving, error, fields: error?.fields ?? {}, open, close, submit }
}
