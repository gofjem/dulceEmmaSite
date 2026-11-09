export const METODOS_PAGO = [
  { value: 'transferencia', label: 'Transferencia bancaria' },
]

// ponytail: clasificación por precio — ≤3500 clásica, >3500 premium
export const COMBOS_GALLETAS = [
  {
    id: 'combo-clasicas',
    nombre: '2 Galletas Clásicas',
    precio: 6500,
    slots: ['clasica', 'clasica'],
    descripcion: 'Elige 2 sabores de nuestras galletas clásicas.',
  },
  {
    id: 'combo-premium',
    nombre: '2 Galletas Premium',
    precio: 7500,
    slots: ['premium', 'premium'],
    descripcion: 'Elige 2 sabores de nuestras galletas premium.',
  },
  {
    id: 'combo-mix',
    nombre: 'Mix: 1 Clásica + 1 Premium',
    precio: 7000,
    slots: ['clasica', 'premium'],
    descripcion: '1 galleta clásica y 1 galleta premium a tu elección.',
  },
]

export const ESTADOS_PEDIDO = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  EN_PREPARACION: 'En preparación',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
}

export const productos = [
  {
    id: 1,
    nombre: 'Torta 3 Leches',
    descripcion: 'Bizcocho empapado en tres tipos de leche con crema chantilly y canela. Un clásico irresistible.',
    precio: 3500,
    stock: 10,
    imagen: '/images/Torta_3Leches.png',
    tag: 'Favorito',
    categoria: 'Torta',
  },
  {
    id: 2,
    nombre: 'Marquesa de Chocolate',
    descripcion: 'Denso, fudgy y con chispas de chocolate belga. Crujiente por fuera, suave por dentro.',
    precio: 3500,
    stock: 8,
    imagen: '/images/Torta_Marquesa.png',
    tag: 'Clásico',
    categoria: 'Brownie',
  },
  {
    id: 3,
    nombre: 'Torta Red Velvet',
    descripcion: 'Bizcocho esponjoso, crema chantilly artesanal y fresas frescas de temporada.',
    precio: 3000,
    stock: 6,
    imagen: '/images/Torta_RedVelvet.png',
    tag: 'Para celebrar',
    categoria: 'Torta',
  },
  {
    id: 4,
    nombre: 'Galletas New York Cookies and Cream',
    descripcion: 'Galleta suave por dentro y crujiente por fuera, con trozos de galleta Oreo y crema.',
    precio: 3500,
    stock: 20,
    imagen: '/images/Galle_Cookies_and_cream.jpg',
    tag: 'Para regalo',
    categoria: 'Cookie',
  },
  {
    id: 5,
    nombre: 'Galletas New York Triple Chocolate',
    descripcion: 'Tres tipos de chocolate en una sola galleta: amargo, semiamargo y blanco.',
    precio: 3500,
    stock: 20,
    imagen: '/images/Galle_3_choco.jpg',
    tag: 'Premium',
    categoria: 'Cookie',
  },
  {
    id: 6,
    nombre: 'Galletas New York Red Velvet',
    descripcion: 'Galleta aterciopelada de red velvet con chispas de chocolate blanco.',
    precio: 3500,
    stock: 15,
    imagen: '/images/Galle_Red_velvet.jpg',
    tag: 'Especial',
    categoria: 'Cookie',
  },
  {
    id: 7,
    nombre: 'Galletas New York Choco Chips Nuez',
    descripcion: 'Galleta con chips de chocolate y nuez tostada. Crujiente en cada mordida.',
    precio: 3500,
    stock: 15,
    imagen: '/images/Galle_Choco_chips_nuez.jpg',
    tag: 'Especial',
    categoria: 'Cookie',
  },
  {
    id: 8,
    nombre: 'Galletas New York Pie de Limón',
    descripcion: 'Galleta estilo New York con un cremoso corazón de pie de limón y un delicado toque cítrico',
    precio: 3700,
    stock: 15,
    imagen: '/images/Galle_PieLimon.png',
    tag: 'Especial',
    categoria: 'Cookie',
  },
  {
    id: 9,
    nombre: 'Quesillo Premium de Caramelo',
    descripcion: 'Delicado postre de textura suave y cremosa, elaborado con ingredientes seleccionados y bañado en un intenso caramelo artesanal que se funde en cada bocado',
    precio: 2700,
    stock: 15,
    imagen: '/images/Quesillo_Art.png',
    tag: 'Especial',
    categoria: 'Postres Artesanales',
  }
]
