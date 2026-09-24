import { useContext } from 'react'
import { ConfirmContext } from './ConfirmContext.js'

// confirm({ title, message, confirmLabel }) devuelve una promesa: true si el usuario confirma, false si cancela o cierra.
export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error('useConfirm debe usarse dentro de ConfirmProvider')
  return confirm
}
