import { getSupabase } from '../_lib/supabase.js'
import { requireAdmin, pick } from '../_lib/auth.js'
import { CAMPOS_PRODUCTO } from './index.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query
  const supabase = getSupabase()

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('productos')
      .update(pick(req.body, CAMPOS_PRODUCTO))
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ producto: data })
  }

  res.status(405).end()
}
