import './info-shared.css'

function Faq() {
  return (
    <div className="content-page wide">
      <h1>Preguntas frecuentes</h1>

      <details className="faq-item" open>
        <summary className="faq-question">¿Cuánto tarda el envío?<svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p className="faq-answer">Entre 2 y 5 días hábiles según la ciudad de destino. Puedes ver el estado de tu pedido en Mis pedidos.</p>
      </details>
      <details className="faq-item">
        <summary className="faq-question">¿Puedo cambiar la talla si no me queda?<svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p className="faq-answer">Sí, tienes 30 días desde la entrega para solicitar un cambio de talla o modelo sin costo adicional.</p>
      </details>
      <details className="faq-item">
        <summary className="faq-question">¿Los productos son originales?<svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p className="faq-answer">Sí, todos los productos que vendemos son 100% originales y verificados directamente con cada marca.</p>
      </details>
      <details className="faq-item">
        <summary className="faq-question">¿Qué métodos de pago aceptan?<svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p className="faq-answer">Aceptamos tarjetas de crédito y débito, PSE y pago contraentrega en las principales ciudades.</p>
      </details>
    </div>
  )
}

export default Faq
