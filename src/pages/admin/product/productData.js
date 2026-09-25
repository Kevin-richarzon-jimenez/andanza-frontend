export const MAIN_FIELDS = ['name', 'brand', 'categoryId', 'price', 'description']
export const SIZE_OPTIONS = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
export const MAX_IMAGES_PER_COLOR = 5

export function sameColor(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

// Los colores de un producto, en el orden en que aparecen sus variantes: cada uno con sus tallas y el stock total.
export function groupColors(product) {
  const groups = []
  for (const variant of product.variants) {
    let group = groups.find((item) => sameColor(item.name, variant.color))
    if (!group) {
      group = { name: variant.color, variants: [], stock: 0 }
      groups.push(group)
    }
    group.variants.push(variant)
    group.stock += variant.stock
  }
  return groups
}

// Las tallas de un selector: las fichas marcadas y las escritas a mano (separadas por coma), sin repetir.
export function collectSizes({ sizes, others }) {
  return [...new Set([...sizes, ...others.split(',').map((item) => item.trim()).filter(Boolean)])]
}
