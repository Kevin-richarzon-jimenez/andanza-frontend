import { useEffect, useId, useRef, useState } from 'react'
import './Select.css'

// Lista desplegable con el estilo de la página (la de un <select> nativo la dibuja el navegador y no se puede
// estilar). Sigue el patrón "select-only combobox" de ARIA: el foco se queda en el botón y el teclado mueve la opción activa.
function Select({ value, options, onChange, ariaLabel, prefix }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const listId = useId()
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  useEffect(() => {
    if (!open) return undefined
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  function openList() {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  function choose(index) {
    setOpen(false)
    if (options[index].value !== value) onChange(options[index].value)
  }

  function handleKeyDown(event) {
    const last = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (open) setActiveIndex((index) => Math.min(index + 1, last))
        else openList()
        break
      case 'ArrowUp':
        event.preventDefault()
        if (open) setActiveIndex((index) => Math.max(index - 1, 0))
        else openList()
        break
      case 'Home':
        if (open) { event.preventDefault(); setActiveIndex(0) }
        break
      case 'End':
        if (open) { event.preventDefault(); setActiveIndex(last) }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open) choose(activeIndex)
        else openList()
        break
      case 'Escape':
        if (open) { event.preventDefault(); setOpen(false) }
        break
      case 'Tab':
        setOpen(false)
        break
      default:
    }
  }

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        role="combobox"
        className="select-button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        {prefix && <span className="select-prefix">{prefix}</span>}
        <span className="select-value">{options[selectedIndex].label}</span>
        <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="select-list" role="listbox" id={listId} aria-label={ariaLabel}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={index === activeIndex ? 'select-option active' : 'select-option'}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
              {index === selectedIndex && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
