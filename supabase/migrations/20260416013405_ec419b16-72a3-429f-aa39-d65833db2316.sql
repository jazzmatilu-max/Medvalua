
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user_chapters"
ON public.user_chapters FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
