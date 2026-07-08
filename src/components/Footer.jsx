import { Instagram, Facebook, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-chocolate text-crema">
      {/* Top gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-dorado/60 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Dulce Emma"
                className="w-14 h-14 rounded-full object-cover border border-dorado/30"
              />
            </div>
            <p className="font-montserrat text-crema/60 text-sm leading-relaxed">
              Pastelería artesanal hecha con amor, ingredientes frescos y mucha dedicación desde nuestra cocina hasta tu mesa.
            </p>
          </div>

          {/* Links */}
          <div className="md:text-center">
            <h4 className="font-playfair text-dorado text-lg mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                ['Inicio', '#inicio'],
                ['Catálogo', '#catalogo'],
                ['Galería', '#galeria'],
                ['Nosotras', '#nosotras'],
                ['Pedidos', '#pedidos'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-montserrat text-crema/60 text-sm hover:text-dorado transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h4 className="font-playfair text-dorado text-lg mb-4">Síguenos</h4>
            <div className="flex md:justify-end gap-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-dorado/40 flex items-center justify-center hover:bg-dorado hover:text-chocolate hover:border-dorado transition-all duration-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-dorado/40 flex items-center justify-center hover:bg-dorado hover:text-chocolate hover:border-dorado transition-all duration-200"
              >
                <Facebook size={18} />
              </a>
            </div>
            <p className="font-montserrat text-crema/50 text-xs">
              Santiago de Chile, Ñuñoa<br />
              hola@dulceemma.cl
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-montserrat text-crema/40 text-xs">
            © {year} Dulce Emma · Todos los derechos reservados
          </p>
          <p className="font-montserrat text-crema/50 text-sm flex items-center gap-1.5">
            Hechos con <Heart size={14} className="text-rosa fill-rosa" /> amor
          </p>
        </div>
      </div>
    </footer>
  )
}
