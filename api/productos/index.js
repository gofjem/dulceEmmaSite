import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    let query = supabase.from('productos').select('*').order('id')
    if (!req.query.all) query = query.eq('activo', true)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ productos: data })
  }

  if (req.method === 'POST') {
    const { nombre, descripcion, precio, stock, imagen, tag, categoria } = req.body
    const { data, error } = await supabase
      .from('productos')
      .insert({ nombre, descripcion, precio: Number(precio), stock: Number(stock), imagen, tag, categoria })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ producto: data })
  }

  res.status(405).end()
}
