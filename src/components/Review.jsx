function Review({ author, rating, text, date, isNew = false }) {
  return (
    <div className={isNew ? 'comment-row is-new' : 'comment-row'}>
      <div className="comment-top">
        <span className="comment-author">
          {author}
          {isNew && <span className="comment-own-tag">Tu comentario</span>}
        </span>
        <span className="comment-stars" aria-label={`${rating} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} className={i < rating ? 'star-icon' : 'star-icon empty'} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
            </svg>
          ))}
        </span>
      </div>
      <p className="comment-text">{text}</p>
      <div className="comment-date">{date}</div>
    </div>
  )
}

export default Review
