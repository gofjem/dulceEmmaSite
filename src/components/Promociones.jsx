import { useEffect, useState } from 'react'
import { Tag } from 'lucide-react'
import { getPromociones } from '../services/api'

const formatPrecio = (n) => `$${n.toLocaleString('es-CL')}`

export default function Promociones() {
  const [promociones, setPromociones] = useState([])

  useEffect(() => {
    getPromociones().then(setPromociones).catch(() => {})
  }, [])

  if (promociones.length === 0) return null

  return (
    <section id="promociones" className="py-20 md:py-24 bg-crema">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-montserrat text-cafe/60 tracking-widest uppercase text-sm mb-2">✦ Combos especiales ✦</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-chocolate font-bold">Promociones</h2>
          <div className="w-16 h-0.5 bg-dorado mx-auto my-4" />
          <p className="font-montserrat text-cafe/70 text-sm">Combos pensados para darte más por menos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map((promo) => (
            <div key={promo.id} className="bg-white rounded-2xl shadow-sm border border-dorado/20 overflow-hidden flex flex-col">
              {promo.imagen
                ? <img src={promo.imagen} alt={promo.nombre} className="w-full h-44 object-cover" />
                : <div className="w-full h-44 bg-dorado/10 flex items-center justify-center">
                    <Tag size={48} className="text-dorado/40" />
                  </div>
              }
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-playfair text-lg text-chocolate font-bold leading-snug">{promo.nombre}</h3>
                  <span className="shrink-0 bg-dorado text-chocolate text-sm font-montserrat font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {formatPrecio(promo.precio)}
                  </span>
                </div>
                {promo.descripcion && (
                  <p className="font-montserrat text-cafe/70 text-sm flex-1 mb-4">{promo.descripcion}</p>
                )}
                <a
                  href="#pedidos"
                  className="mt-auto block text-center font-montserrat text-sm font-semibold py-2 px-4 rounded-xl border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-crema transition-colors"
                >
                  Pedir este combo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
