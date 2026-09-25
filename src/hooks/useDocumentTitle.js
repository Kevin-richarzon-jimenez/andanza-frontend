import { useEffect } from 'react'

const SITE_NAME = 'Andanza'

// "Catálogo · Andanza"; sin título queda solo el nombre del sitio.
export function formatTitle(title) {
  return title ? `${title} · ${SITE_NAME}` : SITE_NAME
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = formatTitle(title)
  }, [title])
}
