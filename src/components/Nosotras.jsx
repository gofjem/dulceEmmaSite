import { useEffect, useRef } from 'react'
import { Heart, Leaf, Award } from 'lucide-react'

const valores = [
  {
    icon: <Heart className="text-rosa" size={28} />,
    titulo: 'Hecho con amor',
    texto: 'Cada postre nace de una receta familiar y un corazón que disfruta crear.',
  },
  {
    icon: <Leaf className="text-cafe" size={28} />,
    titulo: 'Ingredientes frescos',
    texto: 'Seleccionamos los mejores ingredientes locales para que cada sabor sea auténtico.',
  },
  {
    icon: <Award className="text-dorado" size={28} />,
    titulo: 'Calidad artesanal',
    texto: 'Sin atajos, sin conservadores. Solo técnica, paciencia y dedicación real.',
  },
]

export default function Nosotras() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible') },
      { threshold: 0.15 }
    )
    if (leftRef.current) observer.observe(leftRef.current)
    if (rightRef.current) observer.observe(rightRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="nosotras" className="py-20 md:py-28 bg-crema overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Image side */}
          <div ref={leftRef} className="reveal relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto">
              <img
                src="/images/Nosotras.jpeg"
                alt="Emma en su cocina"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -right-4 md:right-0 bg-white rounded-2xl p-4 shadow-xl max-w-[160px]">
              <p className="font-playfair text-chocolate text-3xl font-bold">5+</p>
              <p className="font-montserrat text-cafe text-xs mt-1">años endulzando momentos especiales</p>
            </div>

            {/* Decorative circle */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-4 border-dorado/30 hidden md:block" />
            <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-rosa/40 hidden md:block" />
          </div>

          {/* Text side */}
          <div ref={rightRef} className="reveal">
            <p className="font-montserrat text-cafe tracking-widest uppercase text-sm mb-3">✦ Nuestra historia ✦</p>
            <h2 className="section-title mb-4">Sobre Dulce Emma</h2>
            <div className="w-16 h-0.5 bg-dorado mb-6" />

            <div className="space-y-4 font-montserrat text-cafe/80 text-base leading-relaxed">
              <p>
                <strong className="text-chocolate">Dulce Emma</strong> nació de un sueño muy especial: el sueño de una niña.
              </p>
              <p>
                Todo comenzó cuando Emma tenía apenas cinco años. En su guardería participaron en una actividad de educación financiera donde cada niño debía crear una idea de negocio para desarrollar junto a sus padres. Sin dudarlo, Emma eligió hacer galletas.
              </p>
              <p>
                Ese día, junto a su mamá, preparó sus primeras galletas con mucha ilusión. Al finalizar la actividad, las vendieron en la entrada de la guardería a las familias que iban llegando. Para sorpresa de todos, lograron vender toda su producción. Más que unas simples galletas, aquel momento sembró una semilla que cambiaría nuestra historia.
              </p>
              <p>
                Desde entonces <strong className="text-chocolate">Emma</strong> no dejó de soñar con tener su propio emprendimiento. Con el apoyo de su familia, comenzó a preparar nuevos postres en casa junto a su mamá, descubriendo en cada receta una nueva oportunidad para aprender, crear y compartir momentos felices.
              </p>
              <p>
                Lo que empezó como una tarea escolar se convirtió en una verdadera pasión. Emma descubrió el amor por la repostería, siguiendo los pasos de su mamá, quien también encontró en cada preparación una forma de expresar cariño y dedicación. Juntas comenzaron a perfeccionar recetas, experimentar nuevos sabores y cuidar cada detalle con paciencia y amor.
              </p>
              <p>
                Así nació <strong className="text-chocolate">Dulce Emma</strong>un emprendimiento familiar inspirado en la ilusión de una niña, construido con dedicación, trabajo y el deseo de endulzar la vida de quienes prueban nuestros productos.
              </p>
              <p className="italic text-cafe/70">
                "Hoy, cada galleta y cada postre que sale de nuestra cocina conserva la misma esencia de aquel primer día: la emoción de crear algo hecho con amor, compartirlo con los demás y demostrar que los sueños más grandes pueden comenzar con un pequeño gesto."
              </p>
            </div>

            {/* Values */}
            <div className="mt-8 space-y-4">
              {valores.map((v) => (
                <div key={v.titulo} className="flex items-start gap-4 p-4 bg-white/60 rounded-xl hover:bg-white transition-colors duration-200">
                  <div className="shrink-0 mt-0.5">{v.icon}</div>
                  <div>
                    <h4 className="font-playfair text-chocolate font-semibold">{v.titulo}</h4>
                    <p className="font-montserrat text-cafe/70 text-sm mt-1">{v.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
