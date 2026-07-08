import { useEffect, useRef } from 'react'
import { ShoppingBag, Star } from 'lucide-react'
import { productos } from '../data/productos'

const formatPrecio = (n) => `$${n.toLocaleString('es-CL')}`

function ProductCard({ producto, index }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, index * 100)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={ref} className="reveal card-hover bg-white rounded-2xl overflow-hidden shadow-md group">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 bg-dorado text-chocolate text-xs font-montserrat font-semibold px-3 py-1 rounded-full">
          {producto.tag}
        </span>
        <span className="absolute top-3 right-3 text-2xl">{producto.emoji}</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-playfair text-lg text-chocolate font-semibold leading-tight">
            {producto.nombre}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-dorado text-dorado" />
            ))}
          </div>
        </div>

        <p className="font-montserrat text-cafe/80 text-sm leading-relaxed mb-4">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-playfair text-2xl text-cafe font-bold">{formatPrecio(producto.precio)}</span>
          <a
            href="#pedidos"
            className="flex items-center gap-2 bg-rosa/40 hover:bg-cafe hover:text-crema text-cafe text-sm font-montserrat font-semibold px-4 py-2 rounded-full transition-all duration-300"
          >
            <ShoppingBag size={15} />
            Pedir
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Catalogo() {
  const titleRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible') },
      { threshold: 0.1 }
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="catalogo" className="py-20 md:py-28 bg-crema">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="font-montserrat text-cafe tracking-widest uppercase text-sm mb-2">✦ Nuestros postres ✦</p>
          <h2 className="section-title">Catálogo Artesanal</h2>
          <div className="gold-line" />
          <p className="font-montserrat text-cafe/70 mt-4 max-w-lg mx-auto text-sm md:text-base">
            Cada postre es elaborado a pedido con ingredientes frescos y seleccionados con cariño.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {productos.map((p, i) => (
            <ProductCard key={p.id} producto={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#pedidos" className="btn-primary">
            Hacer un pedido especial ♥
          </a>
        </div>
      </div>
    </section>
  )
}
