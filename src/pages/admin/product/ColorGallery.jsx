import { useState } from 'react'
import { useConfirm } from '../../../confirm/useConfirm.js'
import { deleteProductImage, setProductImageCover, uploadProductImage } from '../../../api/admin.js'
import { IMAGE_ACCEPT, prepareImage } from '../../../utils/imageResize.js'
import { imagesOfColor } from '../../../utils/productImages.js'
import { MAX_IMAGES_PER_COLOR } from './productData.js'
import './ColorGallery.css'

const STATUS_TEXT = { waiting: 'En espera', preparing: 'Preparando...', uploading: 'Subiendo...', done: 'Lista', error: '' }

// Las fotos de un color de un producto (la primera es la portada) y la zona para arrastrar o elegir más. Solo se
// muestra dentro de la vista de ese color, así que siempre está claro a qué pertenecen.
function ColorGallery({ product, color, onChanged }) {
  const confirm = useConfirm()
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const images = imagesOfColor(product, color)
  const free = MAX_IMAGES_PER_COLOR - images.length

  function track(id, changes) {
    setUploads((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }

  // Las fotos se suben de a una: se prepara (reduce y convierte) y se sube, y así se ve el avance de cada una.
  async function addFiles(fileList) {
    const files = [...fileList]
    if (files.length === 0 || busy) return
    setError('')
    const accepted = files.slice(0, free)
    if (files.length > accepted.length) {
      setError(`Este color admite ${MAX_IMAGES_PER_COLOR} fotos: se agregaron solo las primeras ${accepted.length}.`)
    }
    const queue = accepted.map((file, index) => ({ id: `${Date.now()}-${index}`, file, name: file.name, status: 'waiting', message: '' }))
    setUploads(queue)
    setBusy(true)
    for (const item of queue) {
      try {
        track(item.id, { status: 'preparing' })
        const { image, thumbnail } = await prepareImage(item.file)
        track(item.id, { status: 'uploading' })
        await uploadProductImage(product.id, { color, image, thumbnail })
        track(item.id, { status: 'done' })
      } catch (err) {
        track(item.id, { status: 'error', message: err.message || 'No pudimos subir la imagen.' })
      }
    }
    setBusy(false)
    onChanged()
    setTimeout(() => setUploads((current) => current.filter((item) => item.status === 'error')), 2500)
  }

  async function handleCover(image) {
    setError('')
    try {
      await setProductImageCover(product.id, image.id)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(image, position) {
    const confirmed = await confirm({
      title: '¿Eliminar esta imagen?',
      message: `Se eliminará la foto ${position} del color ${color}. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    })
    if (!confirmed) return
    setError('')
    try {
      await deleteProductImage(product.id, image.id)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className="color-gallery" role="group" aria-label={`Imágenes del color ${color}`}>
      <div className="gallery-count">{images.length} de {MAX_IMAGES_PER_COLOR} fotos</div>

      <div className="image-grid">
        {images.map((image, index) => (
          <figure className="image-tile" key={image.id}>
            <img src={image.thumbnailUrl} alt={`${product.name}, ${color}, foto ${index + 1}`} loading="lazy" />
            {index === 0 && <span className="cover-badge">Portada</span>}
            <figcaption className="image-tile-actions">
              {index !== 0 && (
                <button type="button" className="btn btn-small" onClick={() => handleCover(image)} aria-label={`Hacer portada la foto ${index + 1} de ${color}`}>Portada</button>
              )}
              <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(image, index + 1)} aria-label={`Eliminar la foto ${index + 1} de ${color}`}>Eliminar</button>
            </figcaption>
          </figure>
        ))}

        {free > 0 && (
          <label
            className={dragging ? 'image-dropzone is-dragging' : 'image-dropzone'}
            onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              disabled={busy}
              onChange={(event) => { addFiles(event.target.files); event.target.value = '' }}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 16V4" />
              <path d="m7 9 5-5 5 5" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            <span>{busy ? 'Subiendo...' : 'Arrastra fotos o haz clic'}</span>
            <small>JPG, PNG o WebP · quedan {free}</small>
          </label>
        )}
      </div>

      {uploads.length > 0 && (
        <ul className="upload-list" aria-live="polite">
          {uploads.map((item) => (
            <li key={item.id} className={`upload-item is-${item.status}`}>
              <span className="upload-name">{item.name}</span>
              <span className="upload-state">{item.status === 'error' ? item.message : STATUS_TEXT[item.status]}</span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="form-error" role="alert" style={{ marginTop: 10 }}>{error}</p>}
    </div>
  )
}

export default ColorGallery
