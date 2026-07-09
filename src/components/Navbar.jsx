import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Nosotras', href: '#nosotras' },
  { label: 'Pedidos', href: '#pedidos' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-chocolate/95 backdrop-blur-sm shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center group">
          <img
            src="/logo.jpg"
            alt="Dulce Emma"
            className="h-12 w-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-montserrat text-sm text-crema/80 hover:text-dorado transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-dorado after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a href="#pedidos" className="hidden md:inline-block btn-primary text-sm py-2 px-6">
          Hacer pedido
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-crema p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-chocolate/98 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-montserrat text-crema/80 hover:text-dorado transition-colors py-1 border-b border-white/10"
            >
              {link.label}
            </a>
          ))}
          <a href="#pedidos" onClick={() => setOpen(false)} className="btn-primary text-center mt-2 text-sm">
            Hacer pedido
          </a>
        </div>
      </div>
    </nav>
  )
}
