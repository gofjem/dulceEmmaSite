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
                              └─ api/pedidos/index.js   POST/GET
                              └─ api/pedidos/[id].js    GET/PUT/DELETE
                                      └─ api/_lib/supabase.js (service_role key)
                                              └─ Supabase PostgreSQL (tabla: pedidos)
```

The same `api/` handlers run both locally (via `server.js`) and in production (Vercel Serverless Functions). They are framework-agnostic `(req, res)` handlers.

**`server.js` quirk (Express 5):** `req.query` is a non-writable getter in Express 5. The server shadows it with `Object.defineProperty` before calling the `[id].js` handler so `req.query.id` carries the route param.

## Environment variables

Required in `.env` (local) and Vercel dashboard (production):

```
SUPABASE_URL=https://jawekeunlviwlhguwkkn.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_...   # service_role key — server-side only
VITE_ADMIN_PASSWORD=...              # exposed to client via Vite
```

`api/_lib/supabase.js` creates a new client per request (no singleton) using the service_role key — this bypasses Supabase RLS intentionally.

## Key conventions

- **Productos** are static data in `src/data/productos.js` — not stored in DB.
- **Pedidos** are stored in Supabase. `cancelarPedido` does a `PUT estado='Cancelado'`, never a hard delete.
- **Admin auth** is a plain password check against `import.meta.env.VITE_ADMIN_PASSWORD` in `Admin.jsx` — no JWT/session.
- Scroll reveal animations use a single `IntersectionObserver` in `App.jsx` watching `.reveal` class elements.
- Tailwind color names (`chocolate`, `cafe`, `dorado`, `crema`, `rosa`) are custom-defined in `tailwind.config.js`.

## Imágenes de productos

Las imágenes locales van en `public/images/` y se referencian como `/images/nombre.png` en `src/data/productos.js`. Vite las sirve estáticamente desde `public/`.

**Flujo para agregar una imagen nueva:**
1. El usuario pone el archivo en `images/` (raíz del proyecto, carpeta no commiteada).
2. Copiar a `public/images/` con el nombre exacto que espera `productos.js`.
3. Hacer commit de `public/images/archivo.png` junto con el cambio en `productos.js`.

**Estado actual — todas las imágenes son locales (`.png`):**

| Producto | Archivo |
|---|---|
| Torta 3 Leches | `public/images/Torta_3Leches.png` |
| Marquesa de Chocolate | `public/images/Torta_Marquesa.png` |
| Torta Red Velvet | `public/images/Torta_RedVelvet.png` |
| Galletas Cookies and Cream | `public/images/Galle_Cookies_and_cream.jpg` |
| Galletas Triple Chocolate | `public/images/Galle_3_choco.jpg` |
| Galletas Red Velvet | `public/images/Galle_Red_velvet.jpg` |
| Galletas Choco Chips Nuez | `public/images/Galle_Choco_chips_nuez.jpg` |
| Galletas Pie de Limón | `public/images/Galle_PieLimon.png` |

## Production

- **URL:** https://dulce-emma.vercel.app
- **DNS:** Cloudflare (nameservers: `jerry.ns.cloudflare.com`, `saanvi.ns.cloudflare.com`) → A record `76.76.21.21` (Vercel)
- **Domain:** dulceemma.cl — activo y funcionando (nameservers cambiados en Hostinger el 2026-07-10)
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
