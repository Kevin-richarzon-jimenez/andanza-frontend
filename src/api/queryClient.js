import { QueryClient } from '@tanstack/react-query'
import { isServerUnavailable } from './client.js'

// El servidor gratuito tarda entre 2 y 3 minutos en despertar (medido con 0.1 CPU). Mientras tanto se reintenta
// con espera creciente (1, 2, 4, 8 y luego 10 s), unos 3 minutos en total. Cualquier otro error (404, 422...) no
// mejora reintentando.
const MAX_WAKE_RETRIES = 22

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isServerUnavailable(error) && failureCount < MAX_WAKE_RETRIES,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      // Al volver a la pestaña no se pide nada: con el servidor dormido solo despertaría todo de golpe.
      refetchOnWindowFocus: false,
    },
  },
})
