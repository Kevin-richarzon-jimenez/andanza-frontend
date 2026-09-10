# Andanza

E-commerce de calzado. Proyecto de Sena.

## Estructura

```
andanza/
├── frontend/     HTML + CSS estático (sin backend todavía)
├── docs/         Referencia de diseño (mockup original)
└── backend/      (se agrega cuando arranque Spring Boot)
```

`frontend/` y `backend/` son proyectos independientes que se comunican solo por API — no comparten código. Por ahora solo existe `frontend/`.

## Frontend

Páginas de usuario (inicio, catálogo, detalle, carrito, cuenta, información) convertidas a partir del mockup en `docs/mockup.html`. Sin JavaScript de negocio ni conexión a datos reales todavía — el panel de administración se agrega más adelante siguiendo el mismo patrón.

**Previsualizar:**
```
cd frontend
python -m http.server 5500
```
y abrir `http://localhost:5500/`.

### CSS

- `css/base.css` — reset, tipografías, variables de color
- `css/layout.css` — header, nav, footer (compartidos en todas las páginas)
- `css/components.css` — botones, tarjetas de producto, pills, comentarios (reutilizados en varias páginas)
- `css/pages/*.css` — estilos propios de cada grupo de páginas

## Roadmap

- Backend: Spring Boot (Maven), conectado a Postgres (Supabase) vía JDBC/Spring Data JPA.
- Frontend: migración a React más adelante, para que el header/footer duplicado se vuelva un componente reutilizable.
- Deploy: frontend a Vercel, backend a un host con soporte para Java (Render/Railway).
