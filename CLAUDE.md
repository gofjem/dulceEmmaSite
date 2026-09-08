# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev setup (2 terminals required)

```bash
# Terminal 1 — Express API on port 3001
npm run server

# Terminal 2 — Vite frontend on port 5173
npm run dev
```

Vite proxies `/api/*` → `http://localhost:3001` automatically. **Do not use `vercel dev`** — it has a bug on Windows (UV_HANDLE_CLOSING). Always use Express locally.

```bash
npm run build    # production build
npm run preview  # preview production build locally
```

## Architecture

Single-page app with a flat component stack. No router — `App.jsx` checks `window.location.pathname === '/admin'` to render the admin panel instead of the public site.

```
Browser → Vite (5173)
              └─ /api/* → Express server.js (3001)
                              └─ api/productos/index.js  GET(?all) / POST
                              └─ api/productos/[id].js   PUT
                              └─ api/pedidos/index.js    POST/GET
                              └─ api/pedidos/[id].js     GET/PUT/DELETE
                              └─ api/promociones/index.js  GET / POST
                              └─ api/promociones/[id].js   PUT
                                      └─ api/_lib/supabase.js (service_role key)
                                              └─ Supabase PostgreSQL
                                                      └─ tabla: productos
                                                      └─ tabla: pedidos
                                                      └─ tabla: promociones
```

The same `api/` handlers run both locally (via `server.js`) and in production (Vercel Serverless Functions). They are framework-agnostic `(req, res)` handlers.

**`server.js` quirk (Express 5):** `req.query` is a non-writable getter in Express 5. The server shadows it with `Object.defineProperty` before calling the `[id].js` handler so `req.query.id` carries the route param.

## Cuentas y accesos

| Servicio | Cuenta / Usuario | Detalle |
|---|---|---|
| **GitHub (repo)** | `gofjem` | Repo `gofjem/dulceEmmaSite` — autenticado en git local |
| **GitHub (Vercel/Supabase)** | `jemagofe` | Cuenta separada — usada para login en Vercel y Supabase vía GitHub OAuth |
| **Vercel** | `jemagofe` / team `websitedev1` | Email: `cacay.gestion@gmail.com` · Proyecto: `dulce-emma` |
| **Supabase (producción)** | cuenta `jemagofe` (GitHub OAuth) | Project ID: `jawekeunlviwlhguwkkn` · URL: `https://jawekeunlviwlhguwkkn.supabase.co` |
| **Cloudflare / Hostinger** | andreinamquintero@gmail.com | DNS y dominio dulceemma.cl |

> **Trampa frecuente:** `gofjem` y `jemagofe` son cuentas GitHub distintas. El repo de GitHub es `gofjem/dulceEmmaSite` pero Vercel y Supabase están bajo `jemagofe`. Por eso el deploy usa GitHub Actions en vez de la integración nativa de Vercel.

> **Proyecto Supabase temporal:** Durante la sesión 2026-09-03 se creó accidentalmente el proyecto `lfgmtgelwlwxtkihxjpw` (en otra cuenta). El `.env` local quedó apuntando a ese proyecto vacío. **Para dev local correcto, el `.env` debe usar `jawekeunlviwlhguwkkn` (producción).**

## Environment variables

Required in `.env` (local) and Vercel dashboard (production):

```
SUPABASE_URL=https://jawekeunlviwlhguwkkn.supabase.co   # producción — el correcto
SUPABASE_SERVICE_KEY=eyJ...   # service_role key — server-side only
VITE_ADMIN_PASSWORD=...       # exposed to client via Vite
```

`api/_lib/supabase.js` creates a new client per request (no singleton) using the service_role key — this bypasses Supabase RLS intentionally.

## Key conventions

- **Productos** are stored in Supabase (`tabla: productos`). The public site fetches `GET /api/productos` (only `activo=true`). The admin fetches `GET /api/productos?all=true`. `src/data/productos.js` only holds `ESTADOS_PEDIDO` constants now (`METODOS_PAGO` fue eliminado — solo existe transferencia bancaria).
- **Variaciones de producto:** columna `variaciones JSONB` en `productos`. Array de `{nombre, precio, imagen?}`. El primer elemento es la opción principal (índice 0). Si un producto tiene variaciones, `Catalogo.jsx` muestra pill buttons y usa el precio/imagen de la variación activa. `Pedidos.jsx` muestra un sub-selector de tamaño. `Admin.jsx` edita el JSON directo en un textarea. Actualmente solo el Quesillo Premium tiene variaciones. Agregado 2026-09-03.
- **Pedidos** are stored in Supabase. `cancelarPedido` does a `PUT estado='Cancelado'`, never a hard delete.
- El formulario público de `Pedidos.jsx` soporta múltiples líneas de producto por pedido (array `form.lineas`, botones "Agregar otro producto" / quitar). El payload enviado sigue siendo `productos: [...]`, formato que el backend (`api/pedidos/index.js`) y el panel admin ya soportaban desde antes. Agregado 2026-08-14.
- **Admin panel** lives at `/admin`. Auth is a plain password check against `import.meta.env.VITE_ADMIN_PASSWORD`. Has three tabs: **Pedidos** (gestión de estados), **Productos** (CRUD completo), and **Promociones** (CRUD de combos).
- Desactivar un producto o promoción (`activo=false`) lo oculta del sitio público sin borrarlo de la BD.
- **Promociones** son combos con precio fijo (ej. "2x Galletas Choco Chips Nutella — $6.500"). Se gestionan desde `/admin` → Promociones. En el formulario de pedido aparecen como `<optgroup label="🎁 Promociones">` dentro del mismo selector. En el payload del pedido se guardan con `productoId: null` en el array `productos` de Supabase. La sección pública `Promociones.jsx` aparece entre Nosotras y Pedidos solo si hay al menos una promo activa. El link "Promociones" está en la navbar (`Navbar.jsx` → `navLinks`) entre Nosotras y Pedidos.
- Scroll reveal animations use a single `IntersectionObserver` in `App.jsx` watching `.reveal` class elements. Respects `prefers-reduced-motion`: if active, all `.reveal` elements get `visible` immediately without observing.
- Tailwind color names (`chocolate`, `cafe`, `dorado`, `crema`, `rosa`) are custom-defined in `tailwind.config.js`.
- **Catálogo agrupado por categoría:** `Catalogo.jsx` define `GRUPOS[]` con dos secciones: `"Tortas & Postres"` (cats: Torta, Brownie, Postres Artesanales) y `"Galletas"` (cats: Cookie). Productos con categoría no mapeada caen en un bloque "Otros" automático. Para agregar un nuevo grupo basta editar `GRUPOS[]` en `Catalogo.jsx`. No modificar la columna `categoria` de Supabase para encajar en un grupo — editar `GRUPOS[]` en su lugar.
- **Instagram handle correcto:** `@dulceemma.cl` (en `Galeria.jsx`). No usar `@dulce.emma`.

## Imágenes de productos

Las imágenes locales van en `public/images/` y se referencian como `/images/nombre.png`. Vite las sirve estáticamente desde `public/`.

**Flujo para agregar una imagen nueva:**
1. El usuario pone el archivo en `images/` (raíz del proyecto, carpeta no commiteada).
2. Copiar a `public/images/` con el nombre exacto.
3. Hacer commit de `public/images/archivo.png`.
4. Entrar al panel admin → Productos → Editar el producto y escribir la ruta `/images/nombre.png` en el campo Imagen.

**Estado actual — todas las imágenes son locales:**

| Producto | Archivo | Nota |
|---|---|---|
| Torta 3 Leches | `public/images/Torta_3Leches.png` | |
| Marquesa de Chocolate | `public/images/Torta_Marquesa.png` | |
| Torta Red Velvet | `public/images/Torta_RedVelvet.png` | |
| Galletas Cookies and Cream | `public/images/Galle_Cookies_and_cream.jpg` | |
| Galletas Triple Chocolate | `public/images/Galle_3_choco.jpg` | |
| Galletas Red Velvet | `public/images/Galle_Red_velvet.jpg` | |
| Galletas Choco Chips Nuez | `public/images/Galle_Choco_chips_nuez.jpg` | |
| Galletas Pie de Limón | `public/images/Galle_PieLimon.png` | |
| Quesillo Premium — Porción 19 cm | `public/images/Quesillo_19cm.png` | imagen de variación (por defecto) |
| Quesillo Premium — Porción individual | `public/images/Quesillo_Art.png` | imagen de variación alternativa |
| Sección Nosotras | `public/images/Nosotras.jpeg` | |

## Imágenes de promociones

El flujo es idéntico al de productos. Las imágenes van en `public/images/` y se referencian como `/images/nombre.png`.

**Flujo para agregar imagen a una promo:**
1. El usuario pone el archivo en `images/` (raíz del proyecto, carpeta no commiteada).
2. Copiar a `public/images/` con el nombre exacto.
3. Hacer commit de `public/images/archivo.png`.
4. Entrar al panel admin → Promociones → Editar la promo y escribir la ruta `/images/nombre.png` en el campo Imagen.

Si no se asigna imagen, la card muestra un ícono placeholder (Tag de lucide-react).

**Catálogo actual de promociones — gestionado desde el panel admin `/admin` → Promociones:**

| # | Promoción | Precio |
|---|---|---|
| 1 | 2x Galletas Choco Chips Nutella | $6.500 |

> Para crear, editar o desactivar promociones: usar el panel admin, no editar código.

**Catálogo actual (precios en CLP) — gestionado desde el panel admin `/admin` → Productos:**

| # | Producto | Precio | Categoría | Tag |
|---|---|---|---|---|
| 1 | Torta 3 Leches | $3.500 | Torta | Favorito |
| 2 | Marquesa de Chocolate | $3.500 | Brownie | Clásico |
| 3 | Torta Red Velvet | $3.000 | Torta | Para celebrar |
| 4 | Galletas New York Cookies and Cream | $3.500 | Cookie | Para regalo |
| 5 | Galletas New York Triple Chocolate | $3.500 | Cookie | Premium |
| 6 | Galletas New York Red Velvet | $3.500 | Cookie | Especial |
| 7 | Galletas New York Choco Chips Nuez | $3.500 | Cookie | Especial |
| 8 | Galletas New York Pie de Limón | $3.700 | Cookie | Especial |
| 9 | Quesillo Premium de Caramelo | ver variaciones | Postres Artesanales | Especial |

**Variaciones del Quesillo (columna `variaciones` en Supabase):**
```json
[
  {"nombre": "Porción 19 cm", "precio": 12000, "imagen": "/images/Quesillo_19cm.png"},
  {"nombre": "Porción individual", "precio": 2700}
]
```

> Para cambiar precios, agregar o desactivar productos: usar el panel admin, no editar código.

## Production

- **URL:** https://dulce-emma.vercel.app
- **DNS:** Cloudflare (nameservers: `jerry.ns.cloudflare.com`, `saanvi.ns.cloudflare.com`) → A record `76.76.21.21` (Vercel)
- **Domain:** dulceemma.cl — activo y funcionando (nameservers cambiados en Hostinger el 2026-07-10)
- **Deploy:** automático via GitHub Actions (`.github/workflows/deploy.yml`) — cada `git push origin master` corre `npx vercel --prod` con `VERCEL_TOKEN` guardado como secreto en `gofjem/dulceEmmaSite`. Configurado 2026-08-02.
  - `VERCEL_ORG_ID` → `team_m0yDWHN9VfXV8ajFhPzensaS`
  - `VERCEL_PROJECT_ID` → `prj_cEDOb9twjIIdrHWTRF5vgwLRrpmG`
  - El repo GitHub (`gofjem`) y la cuenta Vercel (`jemagofe/websitedev1`) son cuentas separadas — por eso se usa Actions en vez de la integración nativa de Vercel.
- **Pending:** Flow.cl (WebPay Chile) payment integration via `/api/pagos`

## Flow.cl integration (pendiente de implementar)

El código aún NO existe. Cuando se tengan credenciales de Flow.cl, crear estos archivos:

### Archivos a crear

**`api/_lib/flow.js`** — helper compartido (sign + getStatus):
```js
import crypto from 'crypto'

export const FLOW_BASE = process.env.FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api'

export function sign(params, secret = process.env.FLOW_SECRET_KEY) {
  const str = Object.keys(params).sort().map(k => `${k}${params[k]}`).join('')
  return crypto.createHmac('sha256', secret).update(str).digest('hex')
}

export async function getStatus(token) {
  const params = { apiKey: process.env.FLOW_API_KEY, token }
  params.s = sign(params)
  const qs = new URLSearchParams(params).toString()
  const resp = await fetch(`${FLOW_BASE}/payment/getStatus?${qs}`)
  return resp.json()
}
```

**`api/pagos/index.js`** — POST: crea pago en Flow, devuelve `{ url }` para redirigir al usuario:
```js
import { FLOW_BASE, sign } from '../_lib/flow.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { numeroPedido, monto, correo } = req.body
  const appUrl = process.env.PUBLIC_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001')
  const params = {
    apiKey: process.env.FLOW_API_KEY,
    amount: Math.round(monto),
    commerceOrder: numeroPedido,
    currency: 'CLP',
    email: correo,
    subject: `Pedido Dulce Emma ${numeroPedido}`,
    urlConfirmation: `${appUrl}/api/pagos/confirm`,
    urlReturn: `${appUrl}/api/pagos/return`,
  }
  params.s = sign(params)
  const resp = await fetch(`${FLOW_BASE}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  })
  const data = await resp.json()
  if (!resp.ok || data.code) return res.status(500).json({ error: data.message ?? 'Error Flow' })
  return res.status(200).json({ url: `${data.url}?token=${data.token}` })
}
```

**`api/pagos/confirm.js`** — POST webhook que Flow llama para confirmar pago (actualiza Supabase):
```js
import { getStatus } from '../_lib/flow.js'
import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.body.token
  if (!token) return res.status(400).json({ error: 'token requerido' })
  const data = await getStatus(token)
  if (data.status === 2) { // 2 = pagado
    const supabase = getSupabase()
    await supabase.from('pedidos').update({ estado: 'Pagado' }).eq('numero_pedido', data.commerceOrder)
  }
  return res.status(200).json({ ok: true })
}
```

**`api/pagos/return.js`** — GET: Flow redirige al usuario aquí tras pagar, nosotros lo mandamos al frontend:
```js
import { getStatus } from '../_lib/flow.js'

export default async function handler(req, res) {
  const token = req.query.token
  const frontendUrl = process.env.PUBLIC_URL ?? ''
  if (!token) return res.redirect(`${frontendUrl}/pago?exito=0`)
  const data = await getStatus(token)
  const exito = data.status === 2 ? '1' : '0'
  const numero = data.commerceOrder ?? ''
  return res.redirect(`${frontendUrl}/pago?exito=${exito}&numero=${encodeURIComponent(numero)}`)
}
```

**`src/components/PagoResult.jsx`** — página que ve el usuario tras pagar:
```jsx
import { CheckCircle, XCircle } from 'lucide-react'

export default function PagoResult() {
  const params = new URLSearchParams(window.location.search)
  const exito = params.get('exito') === '1'
  const numero = params.get('numero') ?? ''
  return (
    <div className="min-h-screen bg-crema flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {exito ? (
          <>
            <CheckCircle className="text-dorado mx-auto mb-4" size={64} />
            <h1 className="font-playfair text-3xl text-chocolate font-bold mb-2">¡Pago exitoso!</h1>
            {numero && <p className="font-montserrat text-cafe mb-2">Pedido {numero}</p>}
            <p className="font-montserrat text-chocolate/70 text-sm mb-6">
              Recibimos tu pago. Te contactaremos por WhatsApp para coordinar la entrega.
            </p>
          </>
        ) : (
          <>
            <XCircle className="text-rosa mx-auto mb-4" size={64} />
            <h1 className="font-playfair text-3xl text-chocolate font-bold mb-2">Pago no completado</h1>
            <p className="font-montserrat text-chocolate/70 text-sm mb-6">
              Tu pedido fue guardado. Puedes intentar pagar nuevamente o elegir otro método.
            </p>
          </>
        )}
        <a href="/" className="font-montserrat text-cafe underline text-sm">Volver al inicio</a>
      </div>
    </div>
  )
}
```

### Archivos a modificar

**`src/App.jsx`** — agregar ruta `/pago`:
```jsx
import PagoResult from './components/PagoResult'
// En App():
if (window.location.pathname === '/pago') return <PagoResult />
```

**`src/components/Pedidos.jsx`** — en `onSubmit`, después de `crearPedido`, antes del bloque WhatsApp:
```js
if (form.metodoPago === 'webpay') {
  const pago = await iniciarPago({ numeroPedido: resp.numeroPedido, monto: total, correo: form.correo })
  window.location.href = pago.url
  return
}
```

**`server.js`** — agregar rutas de pagos:
```js
import pagosIndex from './api/pagos/index.js'
import pagosConfirm from './api/pagos/confirm.js'
import pagosReturn from './api/pagos/return.js'

app.all('/api/pagos', pagosIndex)
app.all('/api/pagos/confirm', pagosConfirm)
app.all('/api/pagos/return', pagosReturn)
```

### Variables de entorno a agregar

En `.env` local y en Vercel dashboard:
```
FLOW_API_KEY=...           # del panel Flow.cl → Integraciones
FLOW_SECRET_KEY=...        # del panel Flow.cl → Integraciones
FLOW_ENV=sandbox           # cambiar a "production" cuando sea real
PUBLIC_URL=http://localhost:5173   # solo en .env local; en Vercel no se necesita
```

### Estado del proceso de pagos reales
- Flow.cl requiere: cuenta Flow + RUT + cuenta bancaria + inicio de actividades SII
- SII bloqueado hasta tener permiso SEREMI de Salud (requerido para pyme familiar de alimentos)
- Orden: SEREMI → patente municipal → SII → Flow.cl producción
- Sandbox funciona sin nada de lo anterior — solo credenciales de la cuenta Flow
