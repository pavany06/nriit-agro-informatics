
-- Mandis table
CREATE TABLE public.mandis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_te text,
  district_en text NOT NULL,
  district_te text,
  address_en text,
  address_te text,
  phone text,
  crops_en text,
  crops_te text,
  opening_hours text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mandis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read mandis" ON public.mandis FOR SELECT USING (true);
CREATE POLICY "Auth insert mandis" ON public.mandis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update mandis" ON public.mandis FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete mandis" ON public.mandis FOR DELETE TO authenticated USING (true);

-- Feedback table
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  mobile text,
  message text NOT NULL,
  feedback_type text NOT NULL DEFAULT 'feedback',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read feedback" ON public.feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth update feedback" ON public.feedback FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete feedback" ON public.feedback FOR DELETE TO authenticated USING (true);
