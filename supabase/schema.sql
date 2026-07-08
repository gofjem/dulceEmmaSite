CREATE TABLE pedidos (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido   TEXT    UNIQUE NOT NULL,

  -- cliente
  cliente_nombre    TEXT NOT NULL,
  cliente_apellido  TEXT NOT NULL,
  cliente_telefono  TEXT NOT NULL,
  cliente_correo    TEXT NOT NULL,

  -- dirección
  direccion_calle       TEXT NOT NULL,
  direccion_numero      TEXT NOT NULL,
  direccion_comuna      TEXT NOT NULL,
  direccion_ciudad      TEXT NOT NULL,
  direccion_referencias TEXT,

  -- pedido
  productos     JSONB   NOT NULL,
  total         INTEGER NOT NULL,
  fecha_entrega DATE    NOT NULL,
  metodo_pago   TEXT    NOT NULL,
  mensaje       TEXT,
  estado        TEXT    NOT NULL DEFAULT 'Pendiente',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo el service_role key (servidor) puede acceder.
-- La anon key (frontend) queda bloqueada sin políticas explícitas.
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- auto-actualiza updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
