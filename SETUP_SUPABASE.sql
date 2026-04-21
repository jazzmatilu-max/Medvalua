-- ============================================
-- EJECUTA ESTE SQL EN SUPABASE DASHBOARD
-- SQL EDITOR > Nueva Query
-- ============================================

-- 1. Crear tabla de pacientes (si no existe)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  document_id TEXT NOT NULL,
  diagnosis TEXT,
  pcl_result NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad
DROP POLICY IF EXISTS "Users can view their own patients" ON public.patients;
CREATE POLICY "Users can view their own patients" ON public.patients FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own patients" ON public.patients;
CREATE POLICY "Users can insert their own patients" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own patients" ON public.patients;
CREATE POLICY "Users can update their own patients" ON public.patients FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own patients" ON public.patients;
CREATE POLICY "Users can delete their own patients" ON public.patients FOR DELETE USING (auth.uid() = user_id);

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ✅ COMPLETADO
-- La tabla public.patients está lista para usar
-- Ahora los usuarios pueden guardar, actualizar y eliminar sus propios pacientes
