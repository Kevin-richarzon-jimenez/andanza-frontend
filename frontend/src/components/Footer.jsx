import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="cols">
        <div className="col" style={{ flex: 1.4 }}>
          <div className="f-logo">andanza<span>.</span></div>
          <p className="blurb">Calzado de varias marcas reunido en un solo lugar, para cada ruta que decidas tomar.</p>
          <div className="social-row">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="col">
          <h5>Compañía</h5>
          <div><Link to="/info/about">Sobre nosotros</Link></div>
          <div><Link to="/info/contact">Contacto</Link></div>
          <div><Link to="/info/faq">Preguntas frecuentes</Link></div>
        </div>
        <div className="col">
          <h5>Ayuda</h5>
          <div><Link to="/info/shipping">Envíos</Link></div>
          <div><Link to="/info/returns">Cambios y devoluciones</Link></div>
          <div><Link to="/info/size-guide">Guía de tallas</Link></div>
        </div>
        <div className="col">
          <h5>Legal</h5>
          <div><Link to="/info/terms">Términos y condiciones</Link></div>
          <div><Link to="/info/terms">Política de privacidad</Link></div>
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-info">
          <span>© 2026 Andanza</span>
          <span>Barranquilla, Colombia</span>
        </div>
        <div className="payment-methods">
          <span className="payment-badge">Visa</span>
          <span className="payment-badge">Mastercard</span>
          <span className="payment-badge">PSE</span>
          <span className="payment-badge">Contraentrega</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
