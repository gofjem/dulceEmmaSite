import { useEffect, useRef } from 'react'

const fotos = [
  { id: 1, src: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80', alt: 'Pasteles decorados', size: 'tall' },
  { id: 2, src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', alt: 'Torta de chocolate', size: 'normal' },
  { id: 3, src: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80', alt: 'Cupcakes de colores', size: 'normal' },
  { id: 4, src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', alt: 'Macarons', size: 'wide' },
  { id: 5, src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', alt: 'Donuts glaseados', size: 'normal' },
  { id: 6, src: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80', alt: 'Tarta de frutas', size: 'tall' },
  { id: 7, src: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80', alt: 'Galletas decoradas', size: 'normal' },
  { id: 8, src: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80', alt: 'Crème brûlée', size: 'normal' },
]

export default function Galeria() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.gallery-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80)
          }
        })
      },
      { threshold: 0.05 }
    )
    items?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="galeria" className="py-20 md:py-28 bg-rosa/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-montserrat text-cafe tracking-widest uppercase text-sm mb-2">✦ Momentos dulces ✦</p>
          <h2 className="section-title">Galería</h2>
          <div className="gold-line" />
          <p className="font-montserrat text-cafe/70 mt-4 max-w-md mx-auto text-sm md:text-base">
            Cada foto cuenta una historia de sabor, textura y amor artesanal.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {fotos.map((foto, i) => (
            <div
              key={foto.id}
              className={`gallery-item reveal overflow-hidden rounded-2xl cursor-pointer group relative
                ${foto.size === 'tall' ? 'row-span-2' : ''}
                ${foto.size === 'wide' ? 'col-span-2' : ''}
              `}
            >
              <img
                src={foto.src}
                alt={foto.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-chocolate/0 group-hover:bg-chocolate/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-crema font-playfair text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                  {foto.alt}
                </span>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-dorado/0 group-hover:border-dorado/60 rounded-2xl transition-all duration-300" />
            </div>
          ))}
        </div>

        <p className="text-center mt-8 font-montserrat text-cafe/60 text-sm italic">
          ♥ Síguenos en Instagram @dulce.emma para más
        </p>
      </div>
    </section>
  )
}
