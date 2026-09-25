import { keepPreviousData, useQuery } from '@tanstack/react-query'

// Carga datos de la API y devuelve { data, error, loading, reload }.
// "key" identifica la petición: cuando cambia, se vuelve a cargar. Los datos quedan en caché: al volver a una
// pantalla se muestran al instante y se actualizan por detrás. Mientras llega una respuesta nueva, "data"
// conserva la anterior, así la pantalla no parpadea al cambiar de página o de filtros.
// El "loader" recibe { signal } para cancelar la petición si ya no hace falta.
export function useApiData(loader, key) {
  const query = useQuery({
    queryKey: [key],
    queryFn: ({ signal }) => loader({ signal }),
    placeholderData: keepPreviousData,
  })

  return {
    data: query.data ?? null,
    error: query.error,
    loading: query.isFetching,
    reload: () => { query.refetch() },
  }
}
