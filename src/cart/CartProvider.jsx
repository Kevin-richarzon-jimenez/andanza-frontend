import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext.js'

const STORAGE_KEY = 'andanza.cart'

// El carrito vive en el navegador: cada línea guarda lo necesario para mostrarla (nombre, color, talla y
// el precio al agregarla). El precio y el stock que valen son siempre los que calcula el backend.
function loadItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Sin almacenamiento disponible: el carrito dura mientras la pestaña siga abierta.
    }
  }, [items])

  const add = useCallback((item) => {
    setItems((current) => {
      const existing = current.find((line) => line.variantId === item.variantId)
      if (!existing) return [...current, item]
      return current.map((line) =>
        line.variantId === item.variantId ? { ...line, quantity: line.quantity + item.quantity } : line)
    })
  }, [])

  const setQuantity = useCallback((variantId, quantity) => {
    setItems((current) => (quantity <= 0
      ? current.filter((line) => line.variantId !== variantId)
      : current.map((line) => (line.variantId === variantId ? { ...line, quantity } : line))))
  }, [])

  const remove = useCallback((variantId) => {
    setItems((current) => current.filter((line) => line.variantId !== variantId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, line) => sum + line.quantity, 0),
    add,
    setQuantity,
    remove,
    clear,
  }), [items, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
