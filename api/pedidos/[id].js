import { getSupabase } from '../_lib/supabase.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return res.status(404).json({ success: false, error: 'Pedido no encontrado' })
    return res.status(200).json({ success: true, pedido: data })
  }

  if (req.method === 'PUT') {
    const allowed = ['estado', 'cliente_nombre', 'cliente_apellido', 'cliente_telefono', 'cliente_correo',
      'direccion_calle', 'direccion_numero', 'direccion_comuna', 'direccion_ciudad', 'direccion_referencias', 'mensaje']
    const updates = Object.fromEntries(Object.entries(req.body ?? {}).filter(([k]) => allowed.includes(k)))
    const { data, error } = await supabase
      .from('pedidos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true, pedido: data })
  }

  // DELETE = marcar como Cancelado (no borrar de la BD)
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: 'Cancelado' })
      .eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
