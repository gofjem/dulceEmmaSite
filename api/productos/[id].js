import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  const { id } = req.query
  const supabase = getSupabase()

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('productos')
      .update(req.body)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ producto: data })
  }

  res.status(405).end()
}
