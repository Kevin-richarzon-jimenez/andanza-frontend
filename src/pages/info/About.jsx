import './info-shared.css'

function About() {
  return (
    <>
      <div className="about-hero placeholder"><span>[imagen]</span></div>

      <div className="content-page">
        <h1>Sobre nosotros</h1>
        <p>Andanza reúne calzado de distintas marcas en un solo lugar, organizado por el trayecto que vas a caminar: la ciudad, la oficina, la montaña o el día a día.</p>
        <p>Nacimos en Barranquilla, Colombia, con la idea de que elegir zapatos no debería depender de conocer todas las marcas — solo de saber hacia dónde vas.</p>

        <div className="values-row">
          <div className="value-card">
            <div className="title">Variedad real</div>
            <div className="description">Múltiples marcas verificadas, no solo una línea propia.</div>
          </div>
          <div className="value-card">
            <div className="title">Envío a todo el país</div>
            <div className="description">Despachamos desde Barranquilla con cobertura nacional.</div>
          </div>
          <div className="value-card">
            <div className="title">Cambios sencillos</div>
            <div className="description">30 días para cambiar talla o modelo sin complicaciones.</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
