-- Tabla de productos Dulce Emma
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS productos (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT        NOT NULL,
  descripcion TEXT,
  precio      INTEGER     NOT NULL,
  stock       INTEGER     NOT NULL DEFAULT 0,
  imagen      TEXT,
  tag         TEXT,
  categoria   TEXT,
  activo      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed: 9 productos iniciales
INSERT INTO productos (nombre, descripcion, precio, stock, imagen, tag, categoria) VALUES
  ('Torta 3 Leches',                    'Bizcocho empapado en tres tipos de leche con crema chantilly y canela. Un clásico irresistible.',                                                                                            3500, 10, '/images/Torta_3Leches.png',           'Favorito',      'Torta'),
  ('Marquesa de Chocolate',             'Denso, fudgy y con chispas de chocolate belga. Crujiente por fuera, suave por dentro.',                                                                                                   3500,  8, '/images/Torta_Marquesa.png',          'Clásico',       'Brownie'),
  ('Torta Red Velvet',                  'Bizcocho esponjoso, crema chantilly artesanal y fresas frescas de temporada.',                                                                                                            3000,  6, '/images/Torta_RedVelvet.png',         'Para celebrar', 'Torta'),
  ('Galletas New York Cookies and Cream','Galleta suave por dentro y crujiente por fuera, con trozos de galleta Oreo y crema.',                                                                                                    3500, 20, '/images/Galle_Cookies_and_cream.jpg', 'Para regalo',   'Cookie'),
  ('Galletas New York Triple Chocolate', 'Tres tipos de chocolate en una sola galleta: amargo, semiamargo y blanco.',                                                                                                              3500, 20, '/images/Galle_3_choco.jpg',           'Premium',       'Cookie'),
  ('Galletas New York Red Velvet',       'Galleta aterciopelada de red velvet con chispas de chocolate blanco.',                                                                                                                   3500, 15, '/images/Galle_Red_velvet.jpg',        'Especial',      'Cookie'),
  ('Galletas New York Choco Chips Nuez', 'Galleta con chips de chocolate y nuez tostada. Crujiente en cada mordida.',                                                                                                             3500, 15, '/images/Galle_Choco_chips_nuez.jpg',  'Especial',      'Cookie'),
  ('Galletas New York Pie de Limón',     'Galleta estilo New York con un cremoso corazón de pie de limón y un delicado toque cítrico',                                                                                            3700, 15, '/images/Galle_PieLimon.png',          'Especial',      'Cookie'),
  ('Quesillo Premium de Caramelo',       'Delicado postre de textura suave y cremosa, elaborado con ingredientes seleccionados y bañado en un intenso caramelo artesanal que se funde en cada bocado',                            2700, 15, '/images/Quesillo_Art.png',            'Especial',      'Postres Artesanales')
ON CONFLICT DO NOTHING;
