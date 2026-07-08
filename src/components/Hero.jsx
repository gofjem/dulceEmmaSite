import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1600&q=80)',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-chocolate/75 via-chocolate/60 to-chocolate/80" />

      {/* Decorative hearts */}
      <div className="absolute top-1/4 left-8 text-rosa/30 text-5xl select-none animate-float">♥</div>
      <div className="absolute top-1/3 right-10 text-dorado/20 text-3xl select-none animate-float" style={{ animationDelay: '1s' }}>♥</div>
      <div className="absolute bottom-1/3 left-16 text-rosa/20 text-2xl select-none animate-float" style={{ animationDelay: '2s' }}>♥</div>

      {/* Gold lines decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dorado to-transparent" />

      {/* Content */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo principal */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src="/logo.png"
              alt="Dulce Emma"
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-dorado/50"
              style={{ filter: 'drop-shadow(0 0 30px rgba(212,181,130,0.3))' }}
            />
            {/* Anillo dorado decorativo */}
            <div className="absolute -inset-2 rounded-full border border-dorado/30 animate-pulse" />
          </div>
        </div>

        <div className="gold-line" />

        <p className="font-montserrat text-crema/70 text-base md:text-lg mb-10 max-w-xl mx-auto font-light mt-6">
          Cada bocado es un recuerdo hecho a mano con amor,<br className="hidden sm:block" />
          ingredientes frescos y mucha pasión.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#catalogo" className="btn-primary text-base px-10 py-4">
            Ver catálogo ✦
          </a>
          <a href="#pedidos" className="btn-outline text-base px-10 py-4">
            Hacer pedido
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#catalogo"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dorado animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  )
}
