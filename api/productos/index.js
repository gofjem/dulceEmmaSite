import { getSupabase } from '../_lib/supabase.js'
import { requireAdmin, pick } from '../_lib/auth.js'

export const CAMPOS_PRODUCTO = ['nombre', 'descripcion', 'precio', 'stock', 'imagen', 'tag', 'categoria', 'disponibilidad', 'variaciones', 'activo', 'tipo_galleta']

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    if (req.query.all && !requireAdmin(req, res)) return
    let query = supabase.from('productos').select('*').order('id')
    if (!req.query.all) query = query.eq('activo', true)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ productos: data })
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return
    const nuevo = pick(req.body, CAMPOS_PRODUCTO)
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...nuevo, precio: Number(nuevo.precio), stock: Number(nuevo.stock ?? 0) })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ producto: data })
  }

  res.status(405).end()
}
