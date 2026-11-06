-- Migración 003: activa RLS en las tablas públicas
-- Sin políticas a propósito: anon/authenticated quedan sin acceso.
-- La API usa service_role, que se salta RLS, así que sigue funcionando igual.

ALTER TABLE IF EXISTS public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.promociones ENABLE ROW LEVEL SECURITY;

-- Verificación: rowsecurity debe ser true en todas las filas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
