import { useState, useEffect } from 'react'
import { getPedidos, actualizarPedido, cancelarPedido } from '../services/api'

// ponytail: contraseña en var de entorno del cliente; suficiente para panel interno
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD ?? 'dulceemma2024'

const ESTADOS = ['Pendiente', 'En Preparación', 'Listo', 'Entregado', 'Cancelado']

const ESTADO_COLORS = {
  'Pendiente':      'bg-yellow-100 text-yellow-800',
  'En Preparación': 'bg-blue-100 text-blue-800',
  'Listo':          'bg-green-100 text-green-800',
  'Entregado':      'bg-gray-100 text-gray-600',
  'Cancelado':      'bg-red-100 text-red-700',
}

function Login({ onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pass === ADMIN_PASS) onLogin()
    else setError(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F1E8' }}>
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-lg w-80 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center" style={{ color: '#2D1C15', fontFamily: 'Playfair Display, serif' }}>
          Admin · Dulce Emma
        </h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(false) }}
          className="border rounded-lg px-4 py-2 outline-none focus:border-amber-400"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm text-center">Contraseña incorrecta</p>}
        <button
          type="submit"
          className="py-2 rounded-lg text-white font-semibold"
          style={{ background: '#8B5E3C' }}
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function cargar() {
    setLoading(true)
    try {
      setPedidos(await getPedidos())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (auth) cargar() }, [auth])

  async function cambiarEstado(id, estado) {
    if (estado === 'Cancelado') {
      if (!confirm('¿Cancelar este pedido?')) return
      await cancelarPedido(id)
    } else {
      await actualizarPedido(id, { estado })
    }
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  const filtrados = filtro === 'Todos' ? pedidos : pedidos.filter(p => p.estado === filtro)

  return (
    <div className="min-h-screen p-6" style={{ background: '#F7F1E8' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#2D1C15', fontFamily: 'Playfair Display, serif' }}>
            Panel de Pedidos
          </h1>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500">{pedidos.length} pedidos</span>
            <button
              onClick={cargar}
              className="px-4 py-2 rounded-lg text-sm text-white"
              style={{ background: '#8B5E3C' }}
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['Todos', ...ESTADOS].map(e => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filtro === e ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              style={filtro === e ? { background: '#2D1C15' } : {}}
            >
              {e}
              {e !== 'Todos' && (
                <span className="ml-1 opacity-60">
                  ({pedidos.filter(p => p.estado === e).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Estado */}
        {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {/* Tabla */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead style={{ background: '#2D1C15', color: '#F7F1E8' }}>
                <tr>
                  {['Nº Pedido', 'Cliente', 'Productos', 'Total', 'Entrega', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-8">Sin pedidos</td></tr>
                )}
                {filtrados.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#8B5E3C' }}>
                      {p.numero_pedido}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.cliente_nombre} {p.cliente_apellido}</div>
                      <div className="text-gray-400 text-xs">{p.cliente_telefono}</div>
                    </td>
                    <td className="px-4 py-3">
                      {Array.isArray(p.productos)
                        ? p.productos.map(pr => (
                            <div key={pr.id} className="text-xs">
                              {pr.nombre} ×{pr.cantidad}
                            </div>
                          ))
                        : <span className="text-gray-400">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ${p.total?.toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {p.fecha_entrega
                        ? new Date(p.fecha_entrega + 'T12:00:00').toLocaleDateString('es-CL')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.estado}
                        onChange={e => cambiarEstado(p.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ESTADO_COLORS[p.estado]}`}
                      >
                        {ESTADOS.map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
