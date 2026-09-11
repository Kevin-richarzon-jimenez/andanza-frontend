# Andanza — Frontend (v1, estático)

E-commerce de calzado. Proyecto de Sena.

Primera versión del frontend: HTML/CSS/JS plano, sin build tool, convertido a partir del mockup en `docs/mockup.html`. Reemplazada más adelante por una versión en React (ver la rama/historial correspondiente).

## Correr en desarrollo

```
python -m http.server 5500
```
y abrir `http://localhost:5500/`.

## CSS

- `css/base.css` — reset, tipografías, variables de color
- `css/layout.css` — header, nav, footer (compartidos en todas las páginas)
- `css/components.css` — botones, tarjetas de producto, pills, comentarios (reutilizados en varias páginas)
- `css/pages/*.css` — estilos propios de cada grupo de páginas
