# Andanza — Frontend

E-commerce de calzado. Proyecto de Sena.

Repo poly-repo: este es el frontend. El backend (Spring Boot) vive aparte, en [andaza-backend](https://github.com/Kevin-richarzon-jimenez/andaza-backend) — se comunican solo por API, no comparten código ni repo.

## Frontend

Aplicación de una sola página (SPA) construida con React 19 + Vite 5 + React Router 6. Consume la API REST del backend: catálogo, detalle de producto, carrito (totales calculados por el backend), registro e inicio de sesión, favoritos, direcciones, comentarios, contacto y newsletter, además de las páginas de información.

**Requisitos:** Node 24 (LTS). Verificar con `node -v` -- si tenés una versión más vieja, actualizala antes de instalar (`npm install` puede fallar o instalar versiones de paquetes que no corresponden).

**Configuración:** copiar `.env.example` a `.env` (está en `.gitignore`) y ajustar la URL del backend si no corre en el puerto por defecto:

| Variable | Qué es | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8080/api/v1` |

Vite solo expone al navegador las variables que empiezan con `VITE_`, y quedan visibles en el bundle público: ahí nunca van secretos.

**Correr en desarrollo** (con el backend levantado; ver su README):
```
npm install
npm run dev
```
La aplicación queda en `http://localhost:5173`, que es el origen que el backend permite por CORS por defecto.

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

- `main.jsx` — punto de entrada: monta `<App />` dentro de `<BrowserRouter>` y de los proveedores de sesión, favoritos y carrito.
- `App.jsx` — define todas las rutas de la aplicación; las de `/account` exigen sesión.
- `index.css` — reset, variables de diseño (colores, tipografía, espaciados) y estilos compartidos entre muchas páginas/componentes.
- `api/` — un módulo por recurso del backend (`catalog`, `cart`, `favorites`, ...) sobre `client.js`, que agrega el token, normaliza los errores (`ApiError`) y maneja la sesión vencida.
- `auth/` — sesión (token y usuario en `sessionStorage`: sobrevive a recargar, se borra al cerrar la pestaña), `AuthProvider`, `RequireAuth` (páginas de `/account`), `RequireAdmin` (páginas de `/admin`) y `AuthPromptProvider`: para acciones que piden cuenta (favoritos, comentar) abre un popup con `useAuthPrompt().requireLogin(mensaje)` en vez de sacar al usuario de la página, y tras iniciar sesión o registrarse lo devuelve a donde estaba.
- `confirm/` — `ConfirmProvider` y `useConfirm()`: `await confirm({ title, message, confirmLabel })` abre un diálogo y devuelve `true` o `false`. Se usa antes de las acciones que no se deshacen con otro clic: cerrar sesión, eliminar una dirección, quitar un producto del carrito y vaciarlo.
- `cart/` y `favorites/` — estado global con su proveedor y su hook (`useCart`, `useFavorites`). El carrito vive en `localStorage`; los favoritos, en el backend.
- `hooks/` y `utils/` — `useApiData` para cargar datos con estados de carga y error, `useListParams` para guardar filtros y página de un listado en la URL, y utilidades de formato (moneda, fecha, errores de formulario).
- `components/` — piezas reutilizables: `Header`, `Footer`, `Layout`, `AccountLayout`, `AdminLayout`, `AuthLayout`, `ProductCard`, `Pagination`, `Stars`, `Review`, `ReviewSummary` (promedio y distribución de calificaciones), `EmptyState`, `Modal` (base de los diálogos: `AuthPromptDialog`, `ConfirmDialog`), `Select` (lista desplegable con el estilo de la página y navegación por teclado). Los que tienen estilos propios llevan su CSS colocado al lado (`Header.jsx` + `Header.css`); el resto usa `index.css`.
- `pages/` — una carpeta/archivo por pantalla (`Home`, `Catalog`, `ProductDetail`, `Cart`, y las subcarpetas `account/`, `admin/`, `auth/`, `info/`).

## Panel de administración

En `/admin`, solo para cuentas con rol de administrador (a quienes les aparece el enlace "Panel de administración" en "Mi cuenta"):

- **Resumen:** totales y las variantes con poco stock.
- **Productos:** listado con búsqueda y filtro por categoría, crear (con sus variantes), editar, ajustar el stock de cada variante, agregar variantes y eliminar.
- **Categorías:** crear y eliminar (no se elimina una con productos).
- **Comentarios:** ver todos y ocultarlos o volver a mostrarlos.
- **Usuarios:** buscar, dar o quitar el rol de administrador y bloquear o desbloquear cuentas. No permite cambiar la propia cuenta.
- **Mensajes:** los del formulario de contacto, con un enlace para responder por correo.

Las acciones que no se deshacen con otro clic piden confirmación. `RequireAdmin` solo decide qué mostrar: la seguridad real está en el backend, que responde `403` a cualquier petición de administración de alguien que no lo sea. El rol se guarda en la sesión al iniciar sesión, así que quien recibe el rol debe cerrar sesión y volver a entrar para ver el enlace. La primera cuenta de administrador se crea como explica el README del backend; después se puede dar el rol desde "Usuarios".

## Pendiente del backend

Pantallas que hoy muestran un aviso o un estado vacío porque el backend todavía no expone lo necesario: pedidos y pago del carrito, recuperar contraseña, editar datos del perfil, editar o borrar comentarios propios, imágenes, descuentos y calificaciones de producto, y los filtros por marca y género.

## Despliegue

El frontend se despliega en [Vercel](https://vercel.com): se importa el repositorio y sirven los valores por defecto (preset Vite, `npm run build`, carpeta `dist`). Cada merge a `main` publica una versión nueva.

- **`VITE_API_URL`** (Settings → Environment Variables): la URL del backend con el prefijo de la API, por ejemplo `https://mi-backend.onrender.com/api/v1`. Vite la incorpora al construir, así que al cambiarla hay que volver a desplegar.
- **`vercel.json`** reenvía todas las rutas a `index.html`. Sin esto, abrir directamente `/catalog` o `/products/...` daría 404, porque el enrutamiento lo hace React en el navegador.
- El backend debe tener esta URL del frontend en su variable `CORS_ALLOWED_ORIGINS`; si no, el navegador bloquea las peticiones.
