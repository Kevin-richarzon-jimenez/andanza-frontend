# Andanza — Frontend

E-commerce de calzado. Proyecto de Sena.

Repo poly-repo: este es el frontend. El backend (Spring Boot) vive aparte, en [andaza-backend](https://github.com/Kevin-richarzon-jimenez/andaza-backend) — se comunican solo por API, no comparten código ni repo.

## Frontend

Aplicación de una sola página (SPA) construida con React 19 + Vite 5 + React Router 6. Cubre el flujo completo de usuario (inicio, catálogo, detalle de producto, carrito, autenticación, cuenta y páginas de información), sin conexión a backend todavía.

**Requisitos:** Node 24 (LTS). Verificar con `node -v` -- si tenés una versión más vieja, actualizala antes de instalar (`npm install` puede fallar o instalar versiones de paquetes que no corresponden).

**Correr en desarrollo:**
```
npm install
npm run dev
```

**Compilar para producción:**
```
npm run build
```
Genera una carpeta `dist/` con archivos estáticos listos para desplegar (no necesita Node en producción).

**Revisar estilo de código:**
```
npm run lint
```

### Estructura de `src/`

- `main.jsx` — punto de entrada, monta `<App />` dentro de `<BrowserRouter>`.
- `App.jsx` — define todas las rutas de la aplicación.
- `index.css` — reset, variables de diseño (colores, tipografía, espaciados) y estilos compartidos entre muchas páginas/componentes.
- `components/` — piezas reutilizables: `Header`, `Footer`, `Layout`, `AccountLayout`, `AuthLayout`, `ProductCard`, `SaleCard`, `Stars`, `Review`, `EmptyState`. Los que tienen estilos propios llevan su CSS colocado al lado (`Header.jsx` + `Header.css`); el resto usa `index.css`.
- `pages/` — una carpeta/archivo por pantalla (`Home`, `Catalog`, `ProductDetail`, `Cart`, y las subcarpetas `account/`, `auth/`, `info/`).

## Roadmap

- Conectar el frontend a la API real del backend (por ahora todos los datos son de ejemplo, en memoria).
- Deploy: Vercel.
