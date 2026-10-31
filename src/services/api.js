// La contraseña del admin la valida el servidor; se guarda en memoria tras el login.
let adminPassword = ''
export function setAdminPassword(p) { adminPassword = p }
const adminHeaders = (extra = {}) => ({ ...extra, 'x-admin-password': adminPassword })
const JSON_ADMIN = () => adminHeaders({ 'Content-Type': 'application/json' })

// ── PRODUCTOS ─────────────────────────────────────────────────────────────────

export async function getProductos(all = false) {
  const res = await fetch(all ? '/api/productos?all=true' : '/api/productos', all ? { headers: adminHeaders() } : undefined)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al obtener productos')
  return data.productos
}

export async function getProductoById(id) {
  const lista = await getProductos()
  return lista.find((p) => p.id === id) ?? null
}

export async function crearProducto(producto) {
  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: JSON_ADMIN(),
    body: JSON.stringify(producto),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al crear producto')
  return data.producto
}

export async function actualizarProducto(id, updates) {
  const res = await fetch(`/api/productos/${id}`, {
    method: 'PUT',
    headers: JSON_ADMIN(),
    body: JSON.stringify(updates),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al actualizar producto')
  return data.producto
}

// ── PEDIDOS ───────────────────────────────────────────────────────────────────

export async function crearPedido(pedido) {
  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al crear pedido')
  return data
}

export async function getPedidos() {
  const res = await fetch('/api/pedidos', { headers: adminHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al obtener pedidos')
  return data.pedidos
}

export async function getPedidoById(id) {
  const res = await fetch(`/api/pedidos/${id}`, { headers: adminHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Pedido no encontrado')
  return data.pedido
}

export async function actualizarPedido(id, updates) {
  const res = await fetch(`/api/pedidos/${id}`, {
    method: 'PUT',
    headers: JSON_ADMIN(),
    body: JSON.stringify(updates),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al actualizar pedido')
  return data.pedido
}

export async function cancelarPedido(id) {
  const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE', headers: adminHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al cancelar pedido')
  return data
}

// ── PROMOCIONES ───────────────────────────────────────────────────────────────

export async function getPromociones(all = false) {
  const res = await fetch(all ? '/api/promociones?all=true' : '/api/promociones', all ? { headers: adminHeaders() } : undefined)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al obtener promociones')
  return data.promociones
}

export async function crearPromocion(promo) {
  const res = await fetch('/api/promociones', {
    method: 'POST',
    headers: JSON_ADMIN(),
    body: JSON.stringify(promo),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al crear promoción')
  return data.promocion
}

export async function actualizarPromocion(id, updates) {
  const res = await fetch(`/api/promociones/${id}`, {
    method: 'PUT',
    headers: JSON_ADMIN(),
    body: JSON.stringify(updates),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al actualizar promoción')
  return data.promocion
}

// ── PAGOS ─────────────────────────────────────────────────────────────────────
// TODO: implementar con Flow.cl

export async function iniciarPago(pago) {
  const res = await fetch('/api/pagos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pago),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error al iniciar pago')
  return data
}
