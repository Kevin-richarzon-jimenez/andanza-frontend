import { useCallback, useEffect, useMemo, useState } from 'react'
import { FavoritesContext } from './FavoritesContext.js'
import { useAuth } from '../auth/useAuth.js'
import { useAuthPrompt } from '../auth/useAuthPrompt.js'
import { addFavorite, listFavorites, removeFavorite } from '../api/favorites.js'

// Guarda los favoritos del usuario con sesión (lista de productos del backend) y deja marcarlos o quitarlos.
function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const { requireLogin } = useAuthPrompt()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!isAuthenticated) return undefined
    let cancelled = false
    listFavorites()
      .then((favorites) => { if (!cancelled) setItems(favorites) })
      .catch(() => { if (!cancelled) setItems([]) })
    return () => { cancelled = true }
  }, [isAuthenticated])

  // Sin sesión no hay favoritos, aunque el estado conserve los de la sesión anterior.
  const favorites = useMemo(() => (isAuthenticated ? items : []), [isAuthenticated, items])

  const isFavorite = useCallback((productId) => favorites.some((product) => product.id === productId), [favorites])

  const toggle = useCallback(async (product) => {
    if (!isAuthenticated) {
      requireLogin('Para guardar tus favoritos debes iniciar sesión o crear una cuenta.')
      return
    }
    const wasFavorite = items.some((item) => item.id === product.id)
    setItems((current) => (wasFavorite ? current.filter((item) => item.id !== product.id) : [product, ...current]))
    try {
      await (wasFavorite ? removeFavorite(product.id) : addFavorite(product.id))
    } catch {
      setItems((current) => (wasFavorite ? [product, ...current] : current.filter((item) => item.id !== product.id)))
    }
  }, [isAuthenticated, items, requireLogin])

  const value = useMemo(() => ({ favorites, isFavorite, toggle }), [favorites, isFavorite, toggle])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export default FavoritesProvider
