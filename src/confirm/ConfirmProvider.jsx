import { useCallback, useRef, useState } from 'react'
import { ConfirmContext } from './ConfirmContext.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function ConfirmProvider({ children }) {
  const dialogRef = useRef(null)
  const resolveRef = useRef(null)
  const [options, setOptions] = useState({ title: '', message: '', confirmLabel: 'Confirmar' })

  const confirm = useCallback((request) => new Promise((resolve) => {
    resolveRef.current = resolve
    setOptions({ confirmLabel: 'Confirmar', ...request })
    dialogRef.current?.showModal()
  }), [])

  // Confirmar o cancelar cierran el diálogo; Esc y el clic afuera también, y llegan como "cancelar".
  function settle(result) {
    resolveRef.current?.(result)
    resolveRef.current = null
    dialogRef.current?.close()
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        ref={dialogRef}
        title={options.title}
        message={options.message}
        confirmLabel={options.confirmLabel}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
        onClose={() => settle(false)}
      />
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider
