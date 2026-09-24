import EmptyState from '../../components/EmptyState.jsx'
import '../account-shared.css'

// Los pedidos necesitan endpoints y tablas en el backend, que todavía no existen: mientras tanto,
// la pantalla dice la verdad (no hay pedidos) en vez de mostrar datos de ejemplo.
function Orders() {
  return (
    <>
      <h1>Mis pedidos</h1>
      <EmptyState
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        )}
        title="Todavía no tienes pedidos"
        text="Cuando compres algo, aparecerá aquí."
        ctaText="Explorar catálogo"
        ctaHref="/catalog"
      />
    </>
  )
}

export default Orders
