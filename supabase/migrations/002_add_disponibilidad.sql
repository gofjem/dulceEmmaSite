-- Agrega columna disponibilidad a productos
-- Ejecutar en Supabase SQL Editor

ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS disponibilidad TEXT NOT NULL DEFAULT 'Disponible'
  CHECK (disponibilidad IN ('Disponible', 'Agotado', 'Por encargo'));
