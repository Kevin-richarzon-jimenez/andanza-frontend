import { Link } from 'react-router-dom'

function EmptyState({ icon, title, text, ctaText, ctaHref }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-text">{text}</p>
      {ctaText && ctaHref && <Link to={ctaHref} className="btn btn-fill">{ctaText}</Link>}
    </div>
  )
}

export default EmptyState
