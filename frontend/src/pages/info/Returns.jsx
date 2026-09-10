import './info-shared.css'

function Returns() {
  return (
    <div className="content-page wide">
      <h1>Cambios y devoluciones</h1>
      <p>Tienes 30 días desde la entrega para solicitar un cambio de talla, color o modelo.</p>

      <div className="steps-row">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="title">Solicita el cambio</div>
          <div className="description">Desde Mis pedidos, elige el producto y el motivo.</div>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <div className="title">Enviamos la recolección</div>
          <div className="description">Un transportista pasa por el par a cambiar, sin costo.</div>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <div className="title">Recibe el nuevo par</div>
          <div className="description">Te llega la nueva talla o modelo en 3 a 5 días hábiles.</div>
        </div>
      </div>
    </div>
  )
}

export default Returns
