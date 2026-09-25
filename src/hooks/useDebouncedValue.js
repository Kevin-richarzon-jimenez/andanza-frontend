import { useEffect, useState } from 'react'

// Devuelve "value" solo después de que deje de cambiar durante "delay" ms: varios cambios seguidos
// (por ejemplo, clics rápidos en "+") producen una sola consulta a la API.
export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
