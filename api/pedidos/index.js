import { getSupabase } from '../_lib/supabase.js'
import { requireAdmin } from '../_lib/auth.js'

function generarNumeroPedido() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `PE-${yy}${mm}-${seq}`
}

const trim = (s, max) => typeof s === 'string' ? s.trim().slice(0, max) : s

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'POST') {
    const { cliente, direccion, productos, fechaEntrega, metodoPago, mensaje } = req.body

    // Fix 1: trim + longitud máxima en texto libre
    const clienteValidado = {
      nombre:   trim(cliente?.nombre,   100),
      apellido: trim(cliente?.apellido, 100),
      telefono: trim(cliente?.telefono,  20),
      correo:   trim(cliente?.correo,   100),
    }
    const direccionValidada = {
      calle:       trim(direccion?.calle,       100),
      numero:      trim(direccion?.numero,       20),
      comuna:      trim(direccion?.comuna,      100),
      ciudad:      trim(direccion?.ciudad,      100),
      referencias: trim(direccion?.referencias, 300),
    }
    const mensajeValidado = trim(mensaje, 500)

    // Fix 2: recalcular total en servidor — para líneas con productoId verificamos
    // contra el precio real en BD; combos/promos (productoId null) se confían al cliente
    const { data: dbProductos } = await supabase
      .from('productos')
      .select('id, precio, variaciones')
      .eq('activo', true)
    const productMap = Object.fromEntries((dbProductos ?? []).map(p => [p.id, p]))

    const productosValidados = (productos ?? []).map(item => {
      if (!item.productoId) return item
      const dbP = productMap[item.productoId]
      if (!dbP) return item
      const preciosValidos = [dbP.precio, ...(dbP.variaciones?.map(v => v.precio) ?? [])]
      const precioUnitario = preciosValidos.includes(item.precioUnitario) ? item.precioUnitario : dbP.precio
      return { ...item, precioUnitario }
    })
    const totalCalculado = productosValidados.reduce((sum, l) => sum + (l.precioUnitario ?? 0) * (l.cantidad ?? 1), 0)

    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido:        generarNumeroPedido(),
        cliente_nombre:       clienteValidado.nombre,
        cliente_apellido:     clienteValidado.apellido,
        cliente_telefono:     clienteValidado.telefono,
        cliente_correo:       clienteValidado.correo,
        direccion_calle:      direccionValidada.calle,
        direccion_numero:     direccionValidada.numero,
        direccion_comuna:     direccionValidada.comuna,
        direccion_ciudad:     direccionValidada.ciudad,
        direccion_referencias: direccionValidada.referencias || null,
        productos:     productosValidados,
        total:         totalCalculado,
        fecha_entrega: fechaEntrega,
        metodo_pago:   metodoPago,
        mensaje:       mensajeValidado || null,
        estado:        'Pendiente',
      })
      .select('id, numero_pedido')
      .single()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, numeroPedido: data.numero_pedido, id: data.id })
  }

  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true, pedidos: data })
  }

  res.status(405).end()
}
