import { useState, useRef, useEffect } from 'react'
import { Send, CheckCircle, User, MapPin, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react'
import { METODOS_PAGO } from '../data/productos'
import { crearPedido, getProductos } from '../services/api'

const formatPrecio = (n) => `$${n.toLocaleString('es-CL')}`

const inputClass =
  'w-full bg-white border border-dorado/30 rounded-xl px-4 py-3 font-montserrat text-chocolate placeholder-cafe/40 text-sm focus:outline-none focus:ring-2 focus:ring-dorado/50 focus:border-dorado transition-all'

const estadoInicial = {
  nombre: '', apellido: '', telefono: '', correo: '',
  calle: '', numero: '', comuna: '', ciudad: '', referencias: '',
  productoId: '', cantidad: '1', fecha: '',
  metodoPago: '',
  mensaje: '',
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dorado/20">
      <Icon size={15} className="text-dorado shrink-0" />
      <span className="font-montserrat text-crema/70 text-xs uppercase tracking-widest font-semibold">{title}</span>
    </div>
  )
}

export default function Pedidos() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState(estadoInicial)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const sectionRef = useRef(null)

  useEffect(() => {
    getProductos().then(setProductos).catch(console.error)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible') },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const productoSel = productos.find((p) => p.id === Number(form.productoId))
  const total = productoSel ? productoSel.precio * Number(form.cantidad) : 0

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const pedido = {
        cliente: {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          correo: form.correo,
        },
        direccion: {
          calle: form.calle,
          numero: form.numero,
          comuna: form.comuna,
          ciudad: form.ciudad,
          referencias: form.referencias,
        },
        productos: [{
          productoId: Number(form.productoId),
          nombre: productoSel?.nombre ?? '',
          cantidad: Number(form.cantidad),
          precioUnitario: productoSel?.precio ?? 0,
        }],
        total,
        fechaEntrega: form.fecha,
        metodoPago: form.metodoPago,
        mensaje: form.mensaje,
        estado: 'Pendiente',
      }
      const resp = await crearPedido(pedido)
      if (resp.success) {
        setResultado({ numeroPedido: resp.numeroPedido, nombre: form.nombre, total })

        const lineas = [
          `🎂 *Pedido Dulce Emma*`,
          `📋 N° ${resp.numeroPedido}`,
          `👤 ${form.nombre} ${form.apellido} | ${form.telefono}`,
          `📦 ${productoSel?.nombre} x${form.cantidad} — ${formatPrecio(total)}`,
          `📅 Entrega: ${form.fecha}`,
          `💳 Pago: ${form.metodoPago}`,
          `📍 ${form.calle} ${form.numero}, ${form.comuna}, ${form.ciudad}`,
          form.mensaje ? `💬 ${form.mensaje}` : null,
        ].filter(Boolean).join('\n')

        window.open(`https://wa.me/56941077311?text=${encodeURIComponent(lineas)}`, '_blank')
      }
    } catch {
      setError('Hubo un problema al enviar tu pedido. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setResultado(null)
    setForm(estadoInicial)
    setError('')
  }

  const minFecha = new Date().toISOString().split('T')[0]

  return (
    <section id="pedidos" className="py-20 md:py-28 bg-chocolate relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cafe/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-dorado/5 translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorado/60 to-transparent" />

      <div className="max-w-2xl mx-auto px-4 relative">
        <div ref={sectionRef} className="reveal text-center mb-12">
          <p className="font-montserrat text-dorado/80 tracking-widest uppercase text-sm mb-2">✦ Pedidos especiales ✦</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-crema font-bold">Haz tu pedido</h2>
          <div className="w-16 h-0.5 bg-dorado mx-auto my-4" />
          <p className="font-montserrat text-crema/60 text-sm">
            Te confirmaremos disponibilidad por WhatsApp.
          </p>
        </div>

        <div className="bg-crema/5 backdrop-blur-sm border border-dorado/20 rounded-3xl p-6 md:p-10">
          {resultado ? (
            <div className="text-center py-8">
              <CheckCircle className="text-dorado mx-auto mb-4" size={56} />
              <h3 className="font-playfair text-2xl text-crema mb-1">¡Pedido recibido!</h3>
              <p className="font-montserrat text-dorado text-base font-semibold mb-1">{resultado.numeroPedido}</p>
              <p className="font-montserrat text-crema/50 text-sm mb-4">Total: {formatPrecio(resultado.total)}</p>
              <p className="font-montserrat text-crema/70 text-sm mb-6">
                Gracias, <strong className="text-dorado">{resultado.nombre}</strong>. Te abrimos WhatsApp con el resumen — si no se abrió solo, escríbenos al +56 9 4107 7311. ♥
              </p>
              <button onClick={resetForm} className="btn-outline text-sm">
                Hacer otro pedido
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-7">

              {/* ── Datos personales ── */}
              <div>
                <SectionHeader icon={User} title="Datos personales" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Nombre *</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={onChange} placeholder="Tu nombre" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Apellido *</label>
                    <input type="text" name="apellido" value={form.apellido} onChange={onChange} placeholder="Tu apellido" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Teléfono *</label>
                    <input type="tel" name="telefono" value={form.telefono} onChange={onChange} placeholder="+56 9 xxxx xxxx" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Correo *</label>
                    <input type="email" name="correo" value={form.correo} onChange={onChange} placeholder="tu@correo.com" required className={inputClass} />
                  </div>
                </div>
              </div>

              {/* ── Dirección de entrega ── */}
              <div>
                <SectionHeader icon={MapPin} title="Dirección de entrega" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Calle *</label>
                    <input type="text" name="calle" value={form.calle} onChange={onChange} placeholder="Nombre de la calle" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Número *</label>
                    <input type="text" name="numero" value={form.numero} onChange={onChange} placeholder="Ej. 1234" required className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Comuna *</label>
                    <input type="text" name="comuna" value={form.comuna} onChange={onChange} placeholder="Tu comuna" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Ciudad *</label>
                    <input type="text" name="ciudad" value={form.ciudad} onChange={onChange} placeholder="Tu ciudad" required className={inputClass} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Referencias</label>
                  <input type="text" name="referencias" value={form.referencias} onChange={onChange} placeholder="Ej. depto 3B, portón azul, junto a farmacia..." className={inputClass} />
                </div>
              </div>

              {/* ── Tu pedido ── */}
              <div>
                <SectionHeader icon={ShoppingBag} title="Tu pedido" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Producto *</label>
                    <select name="productoId" value={form.productoId} onChange={onChange} required className={inputClass}>
                      <option value="">Seleccionar...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} — {formatPrecio(p.precio)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Cantidad *</label>
                    <input type="number" name="cantidad" value={form.cantidad} onChange={onChange} min="1" max="100" required className={inputClass} />
                  </div>
                </div>

                {total > 0 && (
                  <div className="mt-3 text-right">
                    <span className="font-montserrat text-crema/50 text-xs uppercase tracking-wider">Total estimado: </span>
                    <span className="font-playfair text-dorado text-xl font-bold">{formatPrecio(total)}</span>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Fecha de entrega *</label>
                  <input type="date" name="fecha" value={form.fecha} onChange={onChange} required min={minFecha} className={inputClass} />
                </div>
              </div>

              {/* ── Método de pago ── */}
              <div>
                <SectionHeader icon={CreditCard} title="Método de pago preferido" />
                <select name="metodoPago" value={form.metodoPago} onChange={onChange} required className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {METODOS_PAGO.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <p className="font-montserrat text-crema/40 text-xs mt-2">
                  Te enviaremos las instrucciones de pago al confirmar el pedido.
                </p>
              </div>

              {/* ── Mensaje especial ── */}
              <div>
                <label className="block font-montserrat text-crema/70 text-xs uppercase tracking-wider mb-1.5">Mensaje especial</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={onChange}
                  placeholder="¿Algún detalle especial? ¿Dedicatoria? ¿Alergias?"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rosa font-montserrat text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dorado hover:bg-cafe text-chocolate font-montserrat font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-pulse">Enviando...</span>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar pedido
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
