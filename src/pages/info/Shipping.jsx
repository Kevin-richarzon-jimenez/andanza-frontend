import './info-shared.css'

function Shipping() {
  return (
    <div className="content-page wide">
      <h1>Envíos</h1>
      <p>Despachamos desde Barranquilla con cobertura a todo el país. Los tiempos varían según la ciudad de destino.</p>
      <table className="info-table">
        <thead><tr><th>Zona</th><th>Tiempo estimado</th><th>Costo</th></tr></thead>
        <tbody>
          <tr><td>Barranquilla y área metropolitana</td><td>1 – 2 días hábiles</td><td>$9.900</td></tr>
          <tr><td>Ciudades principales</td><td>2 – 4 días hábiles</td><td>$12.900</td></tr>
          <tr><td>Resto del país</td><td>4 – 7 días hábiles</td><td>$16.900</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Shipping
