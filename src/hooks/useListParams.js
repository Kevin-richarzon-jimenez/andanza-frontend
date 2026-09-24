import { useSearchParams } from 'react-router-dom'

// Filtros y página de un listado guardados en la URL (se pueden compartir y el botón atrás funciona).
// update({ clave: valor }) cambia esos parámetros; un valor vacío quita el parámetro.
export function useListParams() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page')) || 0

  function update(changes) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === '' || value === null || value === undefined) next.delete(key)
      else next.set(key, value)
    }
    setParams(next)
  }

  function setPage(nextPage) {
    update({ page: nextPage > 0 ? String(nextPage) : '' })
  }

  return { params, page, update, setPage }
}
