import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  const supabase = getSupabase()
  const id = req.query.id

  if (req.method === 'PUT') {
    const updates = { ...req.body }
    if (updates.precio !== undefined) updates.precio = Number(updates.precio)
    const { data, error } = await supabase
      .from('promociones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ promocion: data })
  }

  res.status(405).end()
}
