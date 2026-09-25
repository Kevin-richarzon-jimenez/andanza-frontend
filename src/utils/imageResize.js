// Prepara una foto para subirla: la reduce y la convierte a WebP en el navegador, en dos tamaños (la ficha y una
// miniatura para las tarjetas). Así la subida pesa unos 100-200 KB en vez de varios MB y el servidor, que tiene
// muy poca CPU, no tiene que procesar imágenes.
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

const ACCEPTED_TYPES = IMAGE_ACCEPT.split(',')
const MAX_SOURCE_BYTES = 20 * 1024 * 1024
const FULL = { maxSide: 1200, maxBytes: 700 * 1024 }
const THUMBNAIL = { maxSide: 400, maxBytes: 150 * 1024 }
const QUALITIES = [0.82, 0.7, 0.55]

// Un problema con la foto que se le puede explicar a quien la subió.
export class ImageError extends Error {}

function scaledSize(width, height, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

function toWebp(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
}

// Baja la calidad y, si hace falta, el tamaño, hasta que quepa en el límite.
async function encode(bitmap, { maxSide, maxBytes }) {
  let side = maxSide
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { width, height } = scaledSize(bitmap.width, bitmap.height, side)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    for (const quality of QUALITIES) {
      const blob = await toWebp(canvas, quality)
      if (!blob || blob.type !== 'image/webp') {
        throw new ImageError('Tu navegador no puede convertir imágenes a WebP. Prueba con uno más reciente.')
      }
      if (blob.size <= maxBytes) return blob
    }
    side = Math.round(side * 0.8)
  }
  throw new ImageError('No logramos reducir la imagen lo suficiente. Prueba con una más liviana.')
}

// Devuelve { image, thumbnail } (dos Blob WebP) o lanza ImageError.
export async function prepareImage(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImageError(`«${file.name}» no es una imagen JPG, PNG o WebP.`)
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageError(`«${file.name}» pesa demasiado (máximo 20 MB).`)
  }
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new ImageError(`No pudimos leer «${file.name}». ¿Está dañada?`)
  }
  try {
    return { image: await encode(bitmap, FULL), thumbnail: await encode(bitmap, THUMBNAIL) }
  } finally {
    bitmap.close()
  }
}
