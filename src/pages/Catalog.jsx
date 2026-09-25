import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Pagination from '../components/Pagination.jsx'
import Select from '../components/Select.jsx'
import { ProductGridSkeleton } from '../components/Skeleton.jsx'
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
const EMPTY_DRAFT = { category: '', colors: [], sizes: [], minPrice: '', maxPrice: '' }

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function parsePrice(text) {
  const number = Number(text)
  return text.trim() !== '' && Number.isFinite(number) && number >= 0 ? Math.round(number) : null
}

// Dos borradores son iguales si eligen lo mismo, sin importar el orden en que se marcaron color y talla.
function filterKey(filters) {
  return JSON.stringify([filters.category, [...filters.colors].sort(), [...filters.sizes].sort(), filters.minPrice, filters.maxPrice])
}

function FilterNote({ onRetry }) {
  return (
    <p className="filter-note">
      No pudimos cargar esta opción. <button type="button" className="filter-retry" onClick={onRetry}>Reintentar</button>
    </p>
  )
}

function PriceFilter({ draft, bounds, error, onChange }) {
  const hint = (value, fallback) => (value != null ? formatCOP(value) : fallback)

  return (
    <div className="price-filter">
      <div className="price-fields">
        <label>
          Desde
          <input type="number" min="0" step="1000" inputMode="numeric" value={draft.minPrice} placeholder={hint(bounds?.minPrice, 'Mínimo')} onChange={(event) => onChange({ minPrice: event.target.value })} />
        </label>
        <label>
          Hasta
          <input type="number" min="0" step="1000" inputMode="numeric" value={draft.maxPrice} placeholder={hint(bounds?.maxPrice, 'Máximo')} onChange={(event) => onChange({ maxPrice: event.target.value })} />
        </label>
      </div>
      {error && <div className="field-error" role="alert">{error}</div>}
    </div>
  )
}

// Lo que se marca aquí es un borrador: la lista se actualiza al pulsar "Aplicar filtros" (o Enter en el precio),
// así elegir varias opciones seguidas cuesta una sola consulta. Los filtros aplicados viven en la URL
// (se pueden compartir y el botón atrás funciona).
function Filters({ draft, categories, options, hasFilters, dirty, priceError, onDraftChange, onApply, onClear }) {
  const colors = options.data?.colors
  const sizes = options.data?.sizes

  return (
    <aside className="catalog-filters">
      <form onSubmit={onApply}>
        <h5>Categoría</h5>
        <label className="filter-row">
          <input type="radio" name="category" checked={draft.category === ''} onChange={() => onDraftChange({ category: '' })} />
          Todas
        </label>
        {categories.data?.map((item) => (
          <label className="filter-row" key={item.id}>
            <input type="radio" name="category" checked={draft.category === item.name} onChange={() => onDraftChange({ category: item.name })} />
            {item.name}
          </label>
        ))}
        {!categories.data && categories.error && <FilterNote onRetry={categories.reload} />}
        {!categories.data && !categories.error && (
          <div className="filter-skeleton" aria-hidden="true">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
        )}

        <h5>Precio</h5>
        <PriceFilter draft={draft} bounds={options.data} error={priceError} onChange={onDraftChange} />

        {colors?.length !== 0 && (
          <>
            <h5>Color</h5>
            {colors && (
              <div className="color-options">
                {colors.map((name) => {
                  const swatch = swatchFor(name)
                  const selected = draft.colors.includes(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      className={selected ? 'swatch selected' : 'swatch'}
                      style={{ background: swatch.hex, border: swatch.outline ? '1px solid #ddd' : undefined }}
                      aria-label={name}
                      aria-pressed={selected}
                      title={name}
                      onClick={() => onDraftChange({ colors: toggleValue(draft.colors, name) })}
                    />
                  )
                })}
              </div>
            )}
            {!colors && options.error && <FilterNote onRetry={options.reload} />}
            {!colors && !options.error && (
              <div className="color-options" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => <span key={index} className="skeleton skeleton-swatch" />)}
              </div>
            )}
          </>
        )}

        {sizes?.length !== 0 && (
          <>
            <h5>Talla</h5>
            {sizes && (
              <div className="size-options">
                {sizes.map((size) => {
                  const selected = draft.sizes.includes(size)
                  return (
                    <button
                      key={size}
                      type="button"
                      className={selected ? 'pill selected' : 'pill'}
                      aria-pressed={selected}
                      onClick={() => onDraftChange({ sizes: toggleValue(draft.sizes, size) })}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            )}
            {!sizes && options.error && <FilterNote onRetry={options.reload} />}
            {!sizes && !options.error && (
              <div className="size-options" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => <span key={index} className="skeleton skeleton-pill" />)}
              </div>
            )}
          </>
        )}

        <button type="submit" className="btn btn-fill filter-apply" disabled={!dirty}>Aplicar filtros</button>
        {(hasFilters || dirty) && <button type="button" className="clear-filters" onClick={onClear}>Limpiar filtros</button>}
      </form>
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

  const appliedKey = filterKey(applied)
  const [draft, setDraft] = useState(() => ({ category: applied.category, colors: applied.colors, sizes: applied.sizes, minPrice: applied.minPrice, maxPrice: applied.maxPrice }))
  const [syncedKey, setSyncedKey] = useState(appliedKey)
  const [priceError, setPriceError] = useState('')
  const dirty = filterKey(draft) !== appliedKey

  // Si la URL cambia por otro lado (atrás, un enlace, otra pestaña de historial), el borrador se pone al día.
  if (syncedKey !== appliedKey) {
    setSyncedKey(appliedKey)
    setDraft({ category: applied.category, colors: applied.colors, sizes: applied.sizes, minPrice: applied.minPrice, maxPrice: applied.maxPrice })
    setPriceError('')
  }

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

  const categories = useApiData(listCategories, 'categories')
  const options = useApiData(getFilterOptions, 'filter-options')
  const { data: page, error, loading, reload } = useApiData(({ signal }) => listProducts(query, { signal }), `catalog:${params}`)

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

  function changeDraft(changes) {
    setDraft((current) => ({ ...current, ...changes }))
  }

  function applyFilters(event) {
    event.preventDefault()
    if (!dirty) return
    const low = parsePrice(draft.minPrice)
    const high = parsePrice(draft.maxPrice)
    if (low !== null && high !== null && low > high) {
      setPriceError('El mínimo no puede ser mayor al máximo')
      return
    }
    setPriceError('')
    changeFilters({ category: draft.category, color: draft.colors, size: draft.sizes, minPrice: low ?? '', maxPrice: high ?? '' })
  }

  function clearFilters() {
    setDraft(EMPTY_DRAFT)
    setPriceError('')
    if (hasFilters) changeFilters({ category: '', color: [], size: [], minPrice: '', maxPrice: '' })
  }

  function changePage(next) {
    updateParams({ page: next > 0 ? String(next) : '' })
    window.scrollTo(0, 0)
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
          draft={draft}
          categories={categories}
          options={options}
          hasFilters={hasFilters}
          dirty={dirty}
          priceError={priceError}
          onDraftChange={changeDraft}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <div className="catalog-results">
          {error && (
            <div className="page-status" role="alert">
              <p>{error.message}</p>
              <button type="button" className="btn btn-outline btn-small" onClick={reload}>Reintentar</button>
            </div>
          )}

          {!error && !page && <ProductGridSkeleton count={PAGE_SIZE} className="catalog-grid" />}

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

              <Pagination
                page={applied.page}
                totalPages={totalPages}
                onChange={changePage}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Catalog
