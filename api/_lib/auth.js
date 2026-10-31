import crypto from 'crypto'

const hash = s => crypto.createHash('sha256').update(String(s)).digest()

// Devuelve true si la petición trae la contraseña de admin correcta; si no, responde 401.
export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_PASSWORD
  const given = req.headers['x-admin-password']
  if (expected && given && crypto.timingSafeEqual(hash(given), hash(expected))) return true
  res.status(401).json({ success: false, error: 'No autorizado' })
  return false
}

// Copia solo las columnas permitidas, para que el body no pueda escribir columnas arbitrarias.
export function pick(obj, keys) {
  return Object.fromEntries(keys.filter(k => obj?.[k] !== undefined).map(k => [k, obj[k]]))
}
