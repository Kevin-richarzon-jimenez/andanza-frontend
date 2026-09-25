import { useState, useRef } from 'react'
import { changePassword } from '../../api/auth.js'
import { describeError } from '../../utils/formErrors.js'
import '../account-shared.css'

const PASSWORD_RULE = 'Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número'

function isStrong(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

function FieldError({ message }) {
  return message ? <div className="field-error" role="alert">{message}</div> : null
}

function ChangePassword({ showTitle = true }) {
  const [status, setStatus] = useState({ type: 'idle', message: '', fields: {} })
  const formRef = useRef(null)
  const newPasswordRef = useRef(null)
  const confirmRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = formRef.current
    const data = new FormData(form)
    const newPassword = data.get('newPassword')

    newPasswordRef.current?.setCustomValidity(isStrong(newPassword) ? '' : PASSWORD_RULE)
    confirmRef.current?.setCustomValidity(newPassword === data.get('confirmNewPassword') ? '' : 'Las contraseñas no coinciden')
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setStatus({ type: 'sending', message: '', fields: {} })
    try {
      const response = await changePassword({
        currentPassword: data.get('currentPassword'),
        newPassword,
        confirmNewPassword: data.get('confirmNewPassword'),
      })
      setStatus({ type: 'done', message: response.message, fields: {} })
      form.reset()
    } catch (err) {
      const { message, fields } = describeError(err)
      setStatus({ type: 'error', message, fields })
    }
  }

  return (
    <>
      {showTitle && <h1>Cambiar contraseña</h1>}
      <form className="narrow-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="current-password">Contraseña actual</label>
          <input type="password" id="current-password" name="currentPassword" autoComplete="current-password" required />
          <FieldError message={status.fields.currentPassword} />
        </div>
        <div className="field-group">
          <label htmlFor="new-password">Nueva contraseña</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            autoComplete="new-password"
            required
            maxLength={72}
            ref={newPasswordRef}
            onChange={() => newPasswordRef.current?.setCustomValidity('')}
          />
          <FieldError message={status.fields.newPassword} />
        </div>
        <div className="field-group">
          <label htmlFor="confirm-new-password">Confirmar nueva contraseña</label>
          <input
            type="password"
            id="confirm-new-password"
            name="confirmNewPassword"
            autoComplete="new-password"
            required
            ref={confirmRef}
            onChange={() => confirmRef.current?.setCustomValidity('')}
          />
          <FieldError message={status.fields.confirmNewPassword} />
        </div>
        <button type="submit" className="btn btn-fill" style={{ width: '100%', marginTop: '6px' }} disabled={status.type === 'sending'}>
          {status.type === 'sending' ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {status.type === 'done' && <p className="form-feedback">{status.message}</p>}
        {status.type === 'error' && !Object.keys(status.fields).length && (
          <p className="form-error" role="alert">{status.message}</p>
        )}
      </form>
    </>
  )
}

export default ChangePassword
