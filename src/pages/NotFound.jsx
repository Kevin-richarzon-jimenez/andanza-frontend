import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <main className="error-page">
      <p className="error-code">404</p>
      <h1>Esta página se perdió en el camino</h1>
      <p className="error-message">No encontramos lo que buscabas. Puede que el enlace esté roto o que la página se haya movido.</p>
      <div className="error-actions">
        <Link to="/" className="btn btn-fill">Volver al inicio</Link>
        <Link to="/catalog" className="btn btn-outline">Ver catálogo</Link>
      </div>
    </main>
  )
}

export default NotFound
