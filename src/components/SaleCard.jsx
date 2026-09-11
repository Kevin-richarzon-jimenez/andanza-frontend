import { Link } from 'react-router-dom'
import './SaleCard.css'

function SaleCard({ href, name, oldPrice, newPrice, discount }) {
  return (
    <article className="sale-card">
      <span className="badge">-{discount}%</span>
      <Link to={href} className="placeholder"><span>[imagen]</span></Link>
      <div className="info">
        <Link to={href} className="name">{name}</Link>
        <div className="price-row">
          <span className="price-old">{oldPrice}</span>
          <span className="price-new">{newPrice}</span>
        </div>
      </div>
    </article>
  )
}

export default SaleCard
