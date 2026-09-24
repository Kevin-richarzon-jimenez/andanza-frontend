function Stars({ rating = 5, max = 5 }) {
  return (
    <span className="stars" aria-label={`${rating} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={i < rating ? 'star-icon' : 'star-icon empty'}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
        </svg>
      ))}
    </span>
  )
}

export default Stars
