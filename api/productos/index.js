import { getSupabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('id')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ productos: data })
}
