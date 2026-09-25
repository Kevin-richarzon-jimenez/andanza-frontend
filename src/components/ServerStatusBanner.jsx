import { useIsFetching } from '@tanstack/react-query'
import { isServerUnavailable } from '../api/client.js'
import './ServerStatusBanner.css'

// El servidor gratuito se duerme sin tráfico. Mientras las consultas reintentan esperando que despierte,
// se avisa: sin este mensaje la página parecería rota.
function ServerStatusBanner() {
  const waking = useIsFetching({
    predicate: (query) => query.state.fetchFailureCount > 0 && isServerUnavailable(query.state.fetchFailureReason),
  }) > 0

  if (!waking) return null

  return (
    <div className="server-banner" role="status">
      <span className="server-banner-spinner" aria-hidden="true" />
      Estamos despertando el servidor. La primera visita puede tardar un par de minutos; los datos aparecerán en cuanto esté listo.
    </div>
  )
}

export default ServerStatusBanner
