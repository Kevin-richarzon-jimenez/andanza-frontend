import { useEffect, useRef, useState } from 'react'

// Carga datos de la API y devuelve { data, error, loading, reload }.
// "key" identifica la petición: cuando cambia, se vuelve a cargar. Mientras llega la nueva respuesta,
// "data" conserva la anterior, así la pantalla no parpadea al cambiar de página o de filtros.
export function useApiData(loader, key) {
  const loaderRef = useRef(loader)
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ requestKey: null, data: null, error: null })
  const requestKey = `${key}#${reloadCount}`

  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    let cancelled = false
    loaderRef.current()
      .then((data) => { if (!cancelled) setResult({ requestKey, data, error: null }) })
      .catch((error) => { if (!cancelled) setResult({ requestKey, data: null, error }) })
    return () => { cancelled = true }
  }, [requestKey])

  const settled = result.requestKey === requestKey
  return {
    data: result.data,
    error: settled ? result.error : null,
    loading: !settled,
    reload: () => setReloadCount((count) => count + 1),
  }
}
