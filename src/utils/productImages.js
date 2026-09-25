// Las fotos de un producto vienen en `product.images` (cada una con su color, ordenadas: la primera de cada color
// es su portada). Las tallas de un mismo color comparten fotos.

function sameColor(a, b) {
  return a.toLowerCase() === b.toLowerCase()
}

export function imagesOfColor(product, color) {
  return (product.images ?? []).filter((image) => sameColor(image.color, color))
}

// Foto para las tarjetas y el carrito: la portada del primer color con stock; si ese color no tiene fotos, la
// primera foto que haya. Sin fotos, null (se muestra el recuadro de "imagen").
export function coverImage(product) {
  const available = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0]
  const ofColor = available ? imagesOfColor(product, available.color) : []
  return ofColor[0] ?? product.images?.[0] ?? null
}
