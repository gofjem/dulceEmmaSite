import { useState, useEffect } from 'react'
import { getPedidos, actualizarPedido, cancelarPedido, getProductos, crearProducto, actualizarProducto } from '../services/api'

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

const FORM_VACIO = {
  nombre: '', descripcion: '', precio: '', stock: '0',
  imagen: '', tag: '', categoria: '',
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
        <button type="submit" className="py-2 rounded-lg text-white font-semibold" style={{ background: '#8B5E3C' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}

// ── PRODUCTOS ────────────────────────────────────────────────────────────────

function ProductosPanel() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(null)   // null = cerrado | {} = nuevo | {id,...} = editando
  const [guardando, setGuardando] = useState(false)
  const [err, setErr] = useState('')

  async function cargar() {
    setLoading(true)
    try { setProductos(await getProductos(true)) }
    catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    setErr('')
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        stock:  Number(form.stock),
      }
      if (form.id) {
        const updated = await actualizarProducto(form.id, payload)
        setProductos(prev => prev.map(p => p.id === form.id ? updated : p))
      } else {
        const nuevo = await crearProducto(payload)
        setProductos(prev => [...prev, nuevo])
      }
      setForm(null)
    } catch (e) {
      setErr(e.message)
    } finally {
      setGuardando(false)
    }
  }

  async function toggleActivo(p) {
    const updated = await actualizarProducto(p.id, { activo: !p.activo })
    setProductos(prev => prev.map(x => x.id === p.id ? updated : x))
  }

  const input = 'w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400'
  const btn = (color) => `px-3 py-1 rounded-lg text-xs text-white font-medium` + (color === 'cafe' ? ' bg-amber-700 hover:bg-amber-800' : color === 'red' ? ' bg-red-500 hover:bg-red-600' : ' bg-green-600 hover:bg-green-700')

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{productos.length} productos</span>
        <div className="flex gap-2">
          <button onClick={cargar} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: '#8B5E3C' }}>
            Actualizar
          </button>
          <button
            onClick={() => setForm(FORM_VACIO)}
            className="px-4 py-2 rounded-lg text-sm text-white font-semibold"
            style={{ background: '#2D1C15' }}
          >
            + Nuevo producto
          </button>
        </div>
      </div>

      {/* Formulario crear / editar */}
      {form && (
        <form onSubmit={guardar} className="bg-white rounded-2xl shadow p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h3 className="sm:col-span-2 font-bold text-base" style={{ color: '#2D1C15' }}>
            {form.id ? 'Editar producto' : 'Nuevo producto'}
          </h3>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={onChange} required className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows={2} className={`${input} resize-none`} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Precio (CLP) *</label>
            <input name="precio" type="number" value={form.precio} onChange={onChange} required min="0" className={input} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={onChange} min="0" className={input} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Categoría</label>
            <input name="categoria" value={form.categoria} onChange={onChange} placeholder="Torta, Cookie, Brownie…" className={input} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tag</label>
            <input name="tag" value={form.tag} onChange={onChange} placeholder="Favorito, Especial, Premium…" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Imagen (ruta)</label>
            <input name="imagen" value={form.imagen} onChange={onChange} placeholder="/images/nombre.png" className={input} />
          </div>

          {err && <p className="sm:col-span-2 text-red-500 text-xs">{err}</p>}

          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setForm(null)} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={guardando} className="px-4 py-2 rounded-lg text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#8B5E3C' }}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-center text-gray-400 py-8">Cargando…</p>}

      {/* Tabla */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: '#2D1C15', color: '#F7F1E8' }}>
              <tr>
                {['Nombre', 'Precio', 'Categoría', 'Tag', 'Stock', 'Activo', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">Sin productos</td></tr>
              )}
              {productos.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                  <td className="px-4 py-3 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 whitespace-nowrap">${p.precio?.toLocaleString('es-CL')}</td>
                  <td className="px-4 py-3 text-gray-600">{p.categoria}</td>
                  <td className="px-4 py-3 text-gray-600">{p.tag}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setForm({ ...p, precio: String(p.precio), stock: String(p.stock) })} className={btn('cafe')}>
                        Editar
                      </button>
                      <button onClick={() => toggleActivo(p)} className={btn(p.activo ? 'red' : 'green')}>
                        {p.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── PEDIDOS ──────────────────────────────────────────────────────────────────

function PedidosPanel() {
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function cargar() {
    setLoading(true)
    try { setPedidos(await getPedidos()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  async function cambiarEstado(id, estado) {
    if (estado === 'Cancelado') {
      if (!confirm('¿Cancelar este pedido?')) return
      await cancelarPedido(id)
    } else {
      await actualizarPedido(id, { estado })
    }
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  const filtrados = filtro === 'Todos' ? pedidos : pedidos.filter(p => p.estado === filtro)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{pedidos.length} pedidos</span>
        <button onClick={cargar} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: '#8B5E3C' }}>
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['Todos', ...ESTADOS].map(e => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filtro === e ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            style={filtro === e ? { background: '#2D1C15' } : {}}
          >
            {e}
            {e !== 'Todos' && (
              <span className="ml-1 opacity-60">({pedidos.filter(p => p.estado === e).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

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
                          <div key={pr.id} className="text-xs">{pr.nombre} ×{pr.cantidad}</div>
                        ))
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 font-semibold">${p.total?.toLocaleString('es-CL')}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {p.fecha_entrega ? new Date(p.fecha_entrega + 'T12:00:00').toLocaleDateString('es-CL') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.estado}
                      onChange={e => cambiarEstado(p.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ESTADO_COLORS[p.estado]}`}
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── ADMIN SHELL ───────────────────────────────────────────────────────────────

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState('pedidos')

  if (!auth) return <Login onLogin={() => setAuth(true)} />

  return (
    <div className="min-h-screen p-6" style={{ background: '#F7F1E8' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#2D1C15', fontFamily: 'Playfair Display, serif' }}>
            Panel · Dulce Emma
          </h1>
          {/* Tabs */}
          <div className="flex gap-2">
            {[['pedidos', 'Pedidos'], ['productos', 'Productos']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={tab === key
                  ? { background: '#2D1C15', color: '#F7F1E8' }
                  : { background: '#fff', color: '#2D1C15' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'pedidos'   && <PedidosPanel />}
        {tab === 'productos' && <ProductosPanel />}
      </div>
    </div>
  )
}
