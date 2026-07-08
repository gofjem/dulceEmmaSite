import { getSupabase } from '../_lib/supabase.js'

function generarNumeroPedido() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `PE-${yy}${mm}-${seq}`
}

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'POST') {
    const { cliente, direccion, productos, total, fechaEntrega, metodoPago, mensaje } = req.body

    const { data, error } = await supabase
      .from('pedidos')
      .insert({
        numero_pedido:        generarNumeroPedido(),
        cliente_nombre:       cliente.nombre,
        cliente_apellido:     cliente.apellido,
        cliente_telefono:     cliente.telefono,
        cliente_correo:       cliente.correo,
        direccion_calle:      direccion.calle,
        direccion_numero:     direccion.numero,
        direccion_comuna:     direccion.comuna,
        direccion_ciudad:     direccion.ciudad,
        direccion_referencias: direccion.referencias || null,
        productos,
        total,
        fecha_entrega: fechaEntrega,
        metodo_pago:   metodoPago,
        mensaje:       mensaje || null,
        estado:        'Pendiente',
      })
      .select('id, numero_pedido')
      .single()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, numeroPedido: data.numero_pedido, id: data.id })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true, pedidos: data })
  }

  res.status(405).end()
}
