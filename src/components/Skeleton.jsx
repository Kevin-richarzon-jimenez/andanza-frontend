import './Skeleton.css'

// Marcadores de posición mientras llegan los datos: la pantalla mantiene su forma en vez de saltar al cargar.
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="info">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count, className }) {
  return (
    <div className={className} role="status" aria-label="Cargando productos">
      {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  )
}
