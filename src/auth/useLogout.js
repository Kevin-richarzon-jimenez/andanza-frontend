import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../confirm/useConfirm.js'
import { useAuth } from './useAuth.js'

// Cerrar sesión pide confirmar (un clic sin querer no debería sacar a nadie) y lleva al Inicio de la tienda.
export function useLogout() {
  const { logout } = useAuth()
  const confirm = useConfirm()
  const navigate = useNavigate()

  return async function requestLogout() {
    const confirmed = await confirm({
      title: '¿Cerrar sesión?',
      message: 'Tendrás que iniciar sesión de nuevo para volver a entrar a tu cuenta.',
      confirmLabel: 'Cerrar sesión',
    })
    if (!confirmed) return
    navigate('/')
    logout()
  }
}
