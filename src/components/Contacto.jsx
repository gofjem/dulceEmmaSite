import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'

const contactItems = [
  {
    icon: <Phone size={20} className="text-dorado" />,
    label: 'WhatsApp',
    value: '+56 941077311',
    href: 'https://wa.me/56941077311?text=Hola%20Dulce%20Emma%2C%20me%20gustar%C3%ADa%20hacer%20un%20pedido%20%F0%9F%8D%B0',
  },
  {
    icon: <Mail size={20} className="text-dorado" />,
    label: 'Correo',
    value: 'hola@dulceemma.cl',
    href: 'mailto:hola@dulceemma.cl',
  },
  {
    icon: <MapPin size={20} className="text-dorado" />,
    label: 'Ubicación',
    value: 'Santiago de Chile, Ñuñoa · Entregas a domicilio',
    href: null,
  },
]

export default function Contacto() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-crema">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="font-montserrat text-cafe tracking-widest uppercase text-sm mb-2">✦ Encuéntranos ✦</p>
        <h2 className="section-title">Contacto</h2>
        <div className="gold-line" />
        <p className="font-montserrat text-cafe/70 mt-4 mb-12 max-w-md mx-auto text-sm">
          Estamos aquí para endulzar tu día. Escríbenos y con gusto te atendemos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactItems.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-rosa/30 flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <p className="font-montserrat text-cafe/60 text-xs uppercase tracking-wider mb-1">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat text-chocolate text-sm font-medium hover:text-cafe transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-montserrat text-chocolate text-sm font-medium">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-montserrat text-cafe hover:text-chocolate transition-colors text-sm group"
          >
            <div className="w-10 h-10 rounded-full bg-rosa/40 group-hover:bg-rosa flex items-center justify-center transition-colors">
              <Instagram size={18} />
            </div>
            @dulceemma.cl
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-montserrat text-cafe hover:text-chocolate transition-colors text-sm group"
          >
            <div className="w-10 h-10 rounded-full bg-rosa/40 group-hover:bg-rosa flex items-center justify-center transition-colors">
              <Facebook size={18} />
            </div>
            Dulce Emma
          </a>
        </div>
      </div>
    </section>
  )
}
