import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  const supabase = getSupabase()

  if (req.method === 'GET') {
    const all = req.query.all === 'true'
    let q = supabase.from('promociones').select('*').order('created_at', { ascending: false })
    if (!all) q = q.eq('activo', true)
    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ promociones: data })
  }

  if (req.method === 'POST') {
    const { nombre, descripcion, precio, imagen } = req.body
    const { data, error } = await supabase
      .from('promociones')
      .insert({ nombre, descripcion: descripcion || null, precio: Number(precio), imagen: imagen || null })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ promocion: data })
  }

  res.status(405).end()
}
