import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './UserMenu.css'

// Menú desplegable de la cuenta, el mismo en la tienda y en el panel de gestión (cambian los elementos).
// items: [{ key, label, icon, to }, { key, label, icon, onSelect, tone: 'danger' }, { separator: true }]
function UserMenu({ triggerContent, triggerClassName, triggerLabel, name, detail, items }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return undefined
    function closeOnOutsidePress(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  useEffect(() => {
    if (open) rootRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [open])

  // Flechas, Inicio y Fin recorren las opciones; Tab cierra el menú.
  function handleMenuKeyDown(event) {
    const entries = [...event.currentTarget.querySelectorAll('[role="menuitem"]')]
    const index = entries.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') entries[(index + 1) % entries.length]?.focus()
    else if (event.key === 'ArrowUp') entries[(index - 1 + entries.length) % entries.length]?.focus()
    else if (event.key === 'Home') entries[0]?.focus()
    else if (event.key === 'End') entries[entries.length - 1]?.focus()
    else if (event.key === 'Tab') setOpen(false)
    else return
    if (event.key !== 'Tab') event.preventDefault()
  }

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={triggerClassName}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {triggerContent}
      </button>

      {open && (
        <div className="user-menu-panel" id={menuId} role="menu" aria-label={triggerLabel} onKeyDown={handleMenuKeyDown}>
          <div className="user-menu-header">
            <div className="user-menu-name">{name}</div>
            {detail && <div className="user-menu-detail">{detail}</div>}
          </div>
          {items.map((item, index) => {
            if (item.separator) return <div className="user-menu-separator" role="separator" key={`separator-${index}`} />
            const className = item.tone === 'danger' ? 'user-menu-item is-danger' : 'user-menu-item'
            const content = (
              <>
                <span className="user-menu-icon">{item.icon}</span>
                {item.label}
              </>
            )
            return item.to ? (
              <Link key={item.key} to={item.to} role="menuitem" className={className} onClick={() => setOpen(false)}>{content}</Link>
            ) : (
              <button key={item.key} type="button" role="menuitem" className={className} onClick={() => { setOpen(false); item.onSelect() }}>{content}</button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserMenu
