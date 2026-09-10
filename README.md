# Andanza

E-commerce de calzado. Proyecto de Sena.

## Estructura

```
andanza/
├── frontend/     React + Vite (SPA)
└── backend/      (se agrega cuando arranque Spring Boot)
```

`frontend/` y `backend/` son proyectos independientes que se comunican solo por API — no comparten código. Por ahora solo existe `frontend/`.

## Frontend

Aplicación de una sola página (SPA) construida con React 18 + Vite + React Router. Cubre el flujo completo de usuario (inicio, catálogo, detalle de producto, carrito, autenticación, cuenta y páginas de información), sin conexión a backend todavía.

**Requisitos:** Node 20+.

**Correr en desarrollo:**
```
cd frontend
npm install
npm run dev
```

**Compilar para producción:**
```
npm run build
```
Genera una carpeta `dist/` con archivos estáticos listos para desplegar (no necesita Node en producción).

### Estructura de `src/`

- `main.jsx` — punto de entrada, monta `<App />` dentro de `<BrowserRouter>`.
- `App.jsx` — define todas las rutas de la aplicación.
- `index.css` — reset, variables de diseño (colores, tipografía, espaciados) y estilos compartidos entre muchas páginas/componentes.
- `components/` — piezas reutilizables: `Header`, `Footer`, `Layout`, `AccountLayout`, `AuthLayout`, `ProductCard`, `SaleCard`, `Stars`, `Review`, `EmptyState`. Cada uno con su propio CSS colocado al lado (`Header.jsx` + `Header.css`).
- `pages/` — una carpeta/archivo por pantalla (`Home`, `Catalog`, `ProductDetail`, `Cart`, y las subcarpetas `account/`, `auth/`, `info/`).

## Roadmap

- Backend: Spring Boot (Maven), conectado a Postgres (Supabase) vía JDBC/Spring Data JPA.
- Conectar el frontend a la API real (por ahora todos los datos son de ejemplo, en memoria).
- Deploy: frontend a Vercel, backend a un host con soporte para Java (Render/Railway).
