import './Pagination.css'

// page es la página actual en base 0, como en la API.
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Paginación">
      <button type="button" className="btn btn-outline btn-small" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>Página {page + 1} de {totalPages}</span>
      <button type="button" className="btn btn-outline btn-small" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  )
}

export default Pagination
