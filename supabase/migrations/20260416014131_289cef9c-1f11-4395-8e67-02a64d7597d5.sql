
CREATE POLICY "Authenticated users can find unused codes"
ON public.access_codes FOR SELECT
TO authenticated
USING (is_used = false);
