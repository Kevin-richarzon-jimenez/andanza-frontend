import { useState } from 'react'

// Foto principal y miniaturas de un color. Sin fotos, el mismo recuadro de "imagen" que usan las tarjetas.
// Quien la usa le pone `key` con el color, para que al cambiar de color vuelva a la primera foto.
function ProductGallery({ images, alt, emptyText = '[imagen]' }) {
  const [selected, setSelected] = useState(0)

  if (images.length === 0) {
    return (
      <div className="gallery">
        <div className="main-image placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.4" />
            <path d="M21 15l-5-5-4 4-3-3-6 6" />
          </svg>
          <span>{emptyText}</span>
        </div>
      </div>
    )
  }

  const current = images[Math.min(selected, images.length - 1)]

  return (
    <div className="gallery">
      <div className="main-image">
        <img src={current.url} alt={`${alt}, foto ${images.indexOf(current) + 1} de ${images.length}`} decoding="async" />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={index === selected ? 'thumb selected' : 'thumb'}
              aria-label={`Ver la foto ${index + 1}`}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              <img src={image.thumbnailUrl} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
