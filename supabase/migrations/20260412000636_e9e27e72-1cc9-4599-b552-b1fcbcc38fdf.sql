
-- Table to persist chapter evaluation results per patient
CREATE TABLE public.patient_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  chapter_id TEXT NOT NULL,
  chapter_name TEXT NOT NULL,
  deficiency_value NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, chapter_id)
);

ALTER TABLE public.patient_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evaluations"
ON public.patient_evaluations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
ON public.patient_evaluations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations"
ON public.patient_evaluations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations"
ON public.patient_evaluations FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_patient_evaluations_updated_at
BEFORE UPDATE ON public.patient_evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add used_at and used_by tracking to access_codes (used_by already exists)
ALTER TABLE public.access_codes ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Enable realtime for patient_evaluations
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_evaluations;
