import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Select from '../components/Select.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { getFilterOptions, listCategories, listProducts } from '../api/catalog.js'
import { swatchFor } from '../utils/colors.js'
import { formatCOP } from '../utils/formatCurrency.js'
import './Catalog.css'

const PAGE_SIZE = 12
const SORTS = [
  { value: '', label: 'Nombre' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function parsePrice(text) {
  const number = Number(text)
  return text.trim() !== '' && Number.isFinite(number) && number >= 0 ? Math.round(number) : null
}

// Precio desde/hasta: se escribe libremente y se aplica al salir del campo o con Enter (no en cada tecla).
function PriceFilter({ minPrice, maxPrice, bounds, onApply }) {
  const [min, setMin] = useState(minPrice)
  const [max, setMax] = useState(maxPrice)
  const [error, setError] = useState('')
  const [synced, setSynced] = useState({ minPrice, maxPrice })

  // Si la URL cambia por otro lado (limpiar filtros, un enlace), los campos se ponen al día.
  if (synced.minPrice !== minPrice || synced.maxPrice !== maxPrice) {
    setSynced({ minPrice, maxPrice })
    setMin(minPrice)
    setMax(maxPrice)
    setError('')
  }

  function apply() {
    const low = parsePrice(min)
    const high = parsePrice(max)
    if (low !== null && high !== null && low > high) {
      setError('El mínimo no puede ser mayor al máximo')
      return
    }
    setError('')
    if (String(low ?? '') !== minPrice || String(high ?? '') !== maxPrice) {
      onApply({ minPrice: low ?? '', maxPrice: high ?? '' })
    }
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) apply()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') apply()
  }

  const hint = (value, fallback) => (value != null ? formatCOP(value) : fallback)

  return (
    <div className="price-filter" onBlur={handleBlur} onKeyDown={handleKeyDown}>
      <div className="price-fields">
        <label>
          Desde
          <input type="number" min="0" step="1000" inputMode="numeric" value={min} placeholder={hint(bounds?.minPrice, 'Mínimo')} onChange={(event) => setMin(event.target.value)} />
        </label>
        <label>
          Hasta
          <input type="number" min="0" step="1000" inputMode="numeric" value={max} placeholder={hint(bounds?.maxPrice, 'Máximo')} onChange={(event) => setMax(event.target.value)} />
        </label>
      </div>
      {error && <div className="field-error" role="alert">{error}</div>}
    </div>
  )
}

// Cada cambio se aplica al instante: los filtros viven en la URL (se pueden compartir y el botón atrás funciona).
function Filters({ applied, categories, options, hasFilters, onChange, onClear }) {
  return (
    <aside className="catalog-filters">
      <h5>Categoría</h5>
      <label className="filter-row">
        <input type="radio" name="category" checked={applied.category === ''} onChange={() => onChange({ category: '' })} />
        Todas
      </label>
      {categories.map((item) => (
        <label className="filter-row" key={item.id}>
          <input type="radio" name="category" checked={applied.category === item.name} onChange={() => onChange({ category: item.name })} />
          {item.name}
        </label>
      ))}

      <h5>Precio</h5>
      <PriceFilter
        minPrice={applied.minPrice}
        maxPrice={applied.maxPrice}
        bounds={options}
        onApply={onChange}
      />

      {options?.colors.length > 0 && (
        <>
          <h5>Color</h5>
          <div className="color-options">
            {options.colors.map((name) => {
              const swatch = swatchFor(name)
              const selected = applied.colors.includes(name)
              return (
                <button
                  key={name}
                  type="button"
                  className={selected ? 'swatch selected' : 'swatch'}
                  style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }}
                  aria-label={name}
                  aria-pressed={selected}
                  title={name}
                  onClick={() => onChange({ color: toggleValue(applied.colors, name) })}
                />
              )
            })}
          </div>
        </>
      )}

      {options?.sizes.length > 0 && (
        <>
          <h5>Talla</h5>
          <div className="size-options">
            {options.sizes.map((size) => {
              const selected = applied.sizes.includes(size)
              return (
                <button
                  key={size}
                  type="button"
                  className={selected ? 'pill selected' : 'pill'}
                  aria-pressed={selected}
                  onClick={() => onChange({ size: toggleValue(applied.sizes, size) })}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </>
      )}

      {hasFilters && <button type="button" className="clear-filters" onClick={onClear}>Limpiar filtros</button>}
    </aside>
  )
}

function Catalog() {
  const [params, setParams] = useSearchParams()

  const applied = {
    category: params.get('category') ?? '',
    colors: params.getAll('color'),
    sizes: params.getAll('size'),
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    search: params.get('search') ?? '',
    sort: params.get('sort') ?? '',
    page: Number(params.get('page')) || 0,
  }
  const hasFilters = Boolean(applied.category || applied.colors.length || applied.sizes.length || applied.minPrice || applied.maxPrice)

  const query = {
    category: applied.category,
    colors: applied.colors,
    sizes: applied.sizes,
    minPrice: applied.minPrice,
    maxPrice: applied.maxPrice,
    search: applied.search,
    sort: applied.sort,
    page: applied.page,
    size: PAGE_SIZE,
  }

  const { data: categories } = useApiData(listCategories, 'categories')
  const { data: options } = useApiData(getFilterOptions, 'filter-options')
  const { data: page, error, loading, reload } = useApiData(() => listProducts(query), params.toString())

  function updateParams(changes) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      next.delete(key)
      for (const item of [].concat(value)) {
        if (item !== '' && item !== null && item !== undefined) next.append(key, item)
      }
    }
    setParams(next)
  }

  function changeFilters(changes) {
    updateParams({ ...changes, page: '' })
  }

  function clearFilters() {
    changeFilters({ category: '', color: [], size: [], minPrice: '', maxPrice: '' })
  }

  const products = page?.content ?? []
  const totalPages = page?.totalPages ?? 0

  return (
    <>
      <div className="catalog-header">
        <h1 className="catalog-title">Catálogo</h1>
        <div className="catalog-toolbar">
          {page && <span>{page.totalElements} {page.totalElements === 1 ? 'producto encontrado' : 'productos encontrados'}</span>}
          <Select
            ariaLabel="Ordenar por"
            prefix="Ordenar por:"
            value={applied.sort}
            options={SORTS}
            onChange={(sort) => updateParams({ sort, page: '' })}
          />
        </div>
      </div>
      {applied.search && (
        <p className="catalog-search-note">
          Resultados para «{applied.search}» · <button type="button" className="clear-filters" onClick={() => updateParams({ search: '', page: '' })}>Quitar búsqueda</button>
        </p>
      )}

      <div className="catalog-body">
        <Filters
          applied={applied}
          categories={categories ?? []}
          options={options}
          hasFilters={hasFilters}
          onChange={changeFilters}
          onClear={clearFilters}
        />

        <div className="catalog-results">
          {error && (
            <div className="page-status" role="alert">
              <p>{error.message}</p>
              <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
            </div>
          )}

          {!error && !page && <div className="page-status">Cargando productos...</div>}

          {!error && page && products.length === 0 && (
            <EmptyState
              icon={(
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              )}
              title="No encontramos productos con esos filtros"
              text="Prueba con otra categoría, talla o color, o quita algún filtro."
              ctaText="Ver todo el catálogo"
              ctaHref="/catalog"
            />
          )}

          {!error && products.length > 0 && (
            <>
              <div className="catalog-grid" style={{ opacity: loading ? 0.5 : 1 }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="catalog-pagination" aria-label="Paginación">
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    disabled={applied.page === 0}
                    onClick={() => updateParams({ page: applied.page - 1 > 0 ? String(applied.page - 1) : '' })}
                  >
                    Anterior
                  </button>
                  <span>Página {page.page + 1} de {totalPages}</span>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    disabled={applied.page + 1 >= totalPages}
                    onClick={() => updateParams({ page: String(applied.page + 1) })}
                  >
                    Siguiente
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Catalog
