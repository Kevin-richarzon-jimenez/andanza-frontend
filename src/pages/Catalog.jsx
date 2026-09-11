import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import './Catalog.css'

const GENDERS = ['Hombre', 'Mujer', 'Niños']
const BRANDS = ['Nike', 'Puma', 'New Balance', 'Timberland']
const CATEGORIES = ['Tenis', 'Zapatos', 'Mocasines', 'Botas', 'Sandalias']
const COLORS = [
  { label: 'Negro', hex: '#14151C' },
  { label: 'Café', hex: '#8B5E3C' },
  { label: 'Blanco', hex: '#FFFFFF', outline: true },
  { label: 'Óxido', hex: '#C2410C' },
  { label: 'Azul', hex: '#5B3DF5' },
]
const SIZES = [38, 40, 42]

const DEFAULTS = {
  genders: ['Hombre'],
  brands: ['Nike', 'Puma'],
  categories: ['Tenis'],
  price: 500000,
  color: 'Negro',
  size: 40,
  stockOnly: true,
}

const products = [
  { name: 'Tenis Revolution Negro', price: '$289.900', initiallyWishlisted: true },
  { name: 'Tenis 574 Gris', price: '$329.900' },
  { name: 'Tenis Suede Clásico', price: '$249.900' },
  { name: 'Tenis Old Skool Negro', price: '$259.900' },
  { name: 'Zapato Oxford Café', price: '$389.900', initiallyWishlisted: true },
  { name: 'Mocasín Driver Solano', price: '$419.900' },
  { name: 'Bota 6-Inch Trigo', price: '$459.900', initiallyWishlisted: true },
  { name: 'Bota Colorado Café', price: '$499.900' },
]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function Catalog() {
  const [genders, setGenders] = useState(DEFAULTS.genders)
  const [brands, setBrands] = useState(DEFAULTS.brands)
  const [categories, setCategories] = useState(DEFAULTS.categories)
  const [price, setPrice] = useState(DEFAULTS.price)
  const [color, setColor] = useState(DEFAULTS.color)
  const [size, setSize] = useState(DEFAULTS.size)
  const [stockOnly, setStockOnly] = useState(DEFAULTS.stockOnly)

  function clearFilters() {
    setGenders([])
    setBrands([])
    setCategories([])
    setPrice(500000)
    setColor(null)
    setSize(null)
    setStockOnly(false)
  }

  return (
    <>
      <div className="breadcrumb">
        <span><Link to="/">Inicio</Link> &gt; Catálogo</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>{products.length} productos encontrados</span>
          <button type="button" className="sort-select">
            Ordenar por: Relevancia
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </span>
      </div>

      <h1 className="catalog-title">Catálogo</h1>
      <div className="catalog-body">
        <aside className="catalog-filters">
          <h5>Género</h5>
          {GENDERS.map((g) => (
            <label className="filter-row" key={g}>
              <input type="checkbox" checked={genders.includes(g)} onChange={() => setGenders(toggleValue(genders, g))} />
              {g}
            </label>
          ))}

          <h5>Marca</h5>
          {BRANDS.map((b) => (
            <label className="filter-row" key={b}>
              <input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands(toggleValue(brands, b))} />
              {b}
            </label>
          ))}

          <h5>Categoría</h5>
          {CATEGORIES.map((c) => (
            <label className="filter-row" key={c}>
              <input type="checkbox" checked={categories.includes(c)} onChange={() => setCategories(toggleValue(categories, c))} />
              {c}
            </label>
          ))}

          <h5>Precio</h5>
          <div className="price-hint">Hasta ${price.toLocaleString('es-CO')}</div>
          <input
            type="range"
            className="price-range"
            min="0"
            max="500000"
            step="10000"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            aria-label="Precio máximo"
          />

          <h5>Color</h5>
          <div className="color-options">
            {COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={c.label === color ? 'swatch selected' : 'swatch'}
                style={{ background: c.hex, border: c.outline ? '1px solid #ddd' : undefined }}
                aria-label={c.label}
                onClick={() => setColor(c.label)}
              />
            ))}
          </div>

          <h5>Talla</h5>
          <div className="size-options">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={s === size ? 'pill selected' : 'pill'}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <h5>Disponibilidad</h5>
          <label className="filter-row">
            <input type="checkbox" checked={stockOnly} onChange={() => setStockOnly((v) => !v)} />
            Solo con stock
          </label>

          <button type="button" className="btn btn-fill apply-filters">Aplicar filtros</button>
          <button type="button" className="clear-filters" onClick={clearFilters}>Limpiar filtros</button>
        </aside>

        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product.name} href="/product-detail" {...product} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Catalog
