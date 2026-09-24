import { useContext } from 'react'
import { AuthPromptContext } from './AuthPromptContext.js'

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext)
  if (!context) throw new Error('useAuthPrompt debe usarse dentro de AuthPromptProvider')
  return context
}
