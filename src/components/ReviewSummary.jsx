import Stars from './Stars.jsx'
import { formatRating } from '../utils/formatRating.js'
import './ReviewSummary.css'

// Con pocos comentarios la distribución por estrella es ruido (un solo comentario sería "100 % de 5 estrellas").
const MIN_REVIEWS_FOR_DISTRIBUTION = 5

function ReviewSummary({ reviews }) {
  const total = reviews.length
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }))

  return (
    <div className="review-summary">
      <div className="review-average">
        <span className="review-average-value">{formatRating(average)}</span>
        <div>
          <Stars rating={Math.round(average)} />
          <div className="review-average-count">{total} {total === 1 ? 'comentario' : 'comentarios'}</div>
        </div>
      </div>
      {total > MIN_REVIEWS_FOR_DISTRIBUTION && <ul className="review-bars">
        {distribution.map(({ stars, count }) => (
          <li key={stars} aria-label={`${stars} ${stars === 1 ? 'estrella' : 'estrellas'}: ${count} ${count === 1 ? 'comentario' : 'comentarios'}`}>
            <span aria-hidden="true">{stars}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5 14.7 9 21.5 9.6 16.4 14.1 17.9 20.8 12 17.2 6.1 20.8 7.6 14.1 2.5 9.6 9.3 9Z" />
            </svg>
            <span className="review-bar" aria-hidden="true"><span style={{ width: `${(count / total) * 100}%` }} /></span>
            <span className="review-bar-count" aria-hidden="true">{count}</span>
          </li>
        ))}
      </ul>}
    </div>
  )
}

export default ReviewSummary
