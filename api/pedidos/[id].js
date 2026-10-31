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
    // Desde el admin solo se cambia el estado
    const { data, error } = await supabase
      .from('pedidos')
      .update({ estado: req.body?.estado })
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
