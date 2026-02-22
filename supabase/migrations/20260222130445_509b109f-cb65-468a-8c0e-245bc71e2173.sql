
-- News table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_te TEXT,
  summary_en TEXT,
  summary_te TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Government Schemes table
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_te TEXT,
  eligibility_en TEXT,
  eligibility_te TEXT,
  benefit_en TEXT,
  benefit_te TEXT,
  apply_link TEXT,
  scheme_type TEXT NOT NULL DEFAULT 'central' CHECK (scheme_type IN ('central', 'ap', 'ts')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_en TEXT NOT NULL,
  message_te TEXT,
  alert_type TEXT NOT NULL DEFAULT 'info' CHECK (alert_type IN ('info', 'warning', 'danger')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Farming Methods table
CREATE TABLE public.farming_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_te TEXT,
  description_en TEXT,
  description_te TEXT,
  emoji TEXT DEFAULT '🌱',
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_te TEXT,
  youtube_id TEXT NOT NULL,
  emoji TEXT DEFAULT '🎥',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Public read policies (farmers don't need login)
CREATE POLICY "Anyone can read published news" ON public.news FOR SELECT USING (published = true);
CREATE POLICY "Anyone can read published schemes" ON public.schemes FOR SELECT USING (published = true);
CREATE POLICY "Anyone can read active alerts" ON public.alerts FOR SELECT USING (active = true);
CREATE POLICY "Anyone can read published methods" ON public.farming_methods FOR SELECT USING (published = true);
CREATE POLICY "Anyone can read published videos" ON public.videos FOR SELECT USING (published = true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Authenticated users can insert news" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update news" ON public.news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete news" ON public.news FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert schemes" ON public.schemes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update schemes" ON public.schemes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete schemes" ON public.schemes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete alerts" ON public.alerts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert methods" ON public.farming_methods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update methods" ON public.farming_methods FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete methods" ON public.farming_methods FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update videos" ON public.videos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete videos" ON public.videos FOR DELETE TO authenticated USING (true);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON public.schemes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_methods_updated_at BEFORE UPDATE ON public.farming_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
