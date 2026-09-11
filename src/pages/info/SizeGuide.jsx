import './info-shared.css'

function SizeGuide() {
  return (
    <div className="content-page wide">
      <h1>Guía de tallas</h1>
      <p className="size-note">Estas equivalencias son de referencia general; algunos modelos pueden variar levemente según la marca.</p>
      <table className="info-table">
        <thead><tr><th>Colombia</th><th>US</th><th>EU</th><th>Centímetros</th></tr></thead>
        <tbody>
          <tr><td>36</td><td>5.5</td><td>36</td><td>22.5 cm</td></tr>
          <tr><td>38</td><td>7</td><td>38</td><td>24.0 cm</td></tr>
          <tr><td>40</td><td>8.5</td><td>40</td><td>25.5 cm</td></tr>
          <tr><td>42</td><td>10</td><td>42</td><td>27.0 cm</td></tr>
          <tr><td>44</td><td>11.5</td><td>44</td><td>28.5 cm</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default SizeGuide
