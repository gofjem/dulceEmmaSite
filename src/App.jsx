import { useEffect } from 'react'
import Admin from './components/Admin'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Catalogo from './components/Catalogo'
import Galeria from './components/Galeria'
import Nosotras from './components/Nosotras'
import Pedidos from './components/Pedidos'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  if (window.location.pathname === '/admin') return <Admin />

  // Global scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Catalogo />
        <Galeria />
        <Nosotras />
        <Pedidos />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
