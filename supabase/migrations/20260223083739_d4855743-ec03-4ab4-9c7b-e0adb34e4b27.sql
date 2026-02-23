
-- Add new columns to farming_methods
ALTER TABLE public.farming_methods
  ADD COLUMN IF NOT EXISTS steps_en text,
  ADD COLUMN IF NOT EXISTS steps_te text,
  ADD COLUMN IF NOT EXISTS benefits_en text,
  ADD COLUMN IF NOT EXISTS benefits_te text,
  ADD COLUMN IF NOT EXISTS suitable_crops_en text,
  ADD COLUMN IF NOT EXISTS suitable_crops_te text,
  ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'easy',
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'organic',
  ADD COLUMN IF NOT EXISTS video_url text;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.farming_methods;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('farming-images', 'farming-images', true);

-- Storage RLS: anyone can view, authenticated can upload/delete
CREATE POLICY "Public read farming images" ON storage.objects FOR SELECT USING (bucket_id = 'farming-images');
CREATE POLICY "Auth upload farming images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'farming-images');
CREATE POLICY "Auth delete farming images" ON storage.objects FOR DELETE USING (bucket_id = 'farming-images');
