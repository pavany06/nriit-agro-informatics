

# Modern Farming Methods Page - Enhancement Plan

## Current State
The Farming Methods page currently shows a simple list of cards fetched from the `farming_methods` database table, with name, emoji, image URL, and description in English/Telugu. The admin panel allows adding methods with basic text fields and an image URL.

## What We Will Implement

### 1. Richer Content per Method
Add new database columns to the `farming_methods` table:
- `steps_en` / `steps_te` (text) -- Step-by-step implementation guide
- `benefits_en` / `benefits_te` (text) -- Key benefits list
- `suitable_crops_en` / `suitable_crops_te` (text) -- Which crops this method works for
- `difficulty` (text) -- "easy", "medium", "advanced"
- `category` (text) -- "organic", "irrigation", "soil", "technology", "pest_management"
- `video_url` (text) -- Optional YouTube link for the method

### 2. Image Upload in Admin Panel
- Create a `farming-images` storage bucket so admins can upload images directly instead of pasting URLs
- Add a file upload input to the admin form for farming methods
- Upload images to storage and auto-set the `image_url` field

### 3. Real-time Data Refresh
- Enable Supabase Realtime on the `farming_methods` table
- When admin adds/edits/deletes a method, the farmer-facing page updates instantly without refresh

### 4. Enhanced Farmer-Facing UI
- Add category filter chips (Organic, Irrigation, Soil, Technology, Pest Management)
- Expandable cards: tap a method to see full details (steps, benefits, suitable crops)
- Difficulty badge on each card (Easy/Medium/Advanced with color coding)
- Embedded YouTube video player when a video URL is provided
- Search/filter bar to find methods quickly

### 5. Updated Admin Form
- Add all new fields (steps, benefits, suitable crops, difficulty, category, video URL)
- Image file upload button replacing the plain URL input
- Auto-translation for all new text fields (English to Telugu)

---

## Technical Details

### Database Migration
```sql
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

-- Storage RLS: anyone can view, authenticated can upload
CREATE POLICY "Public read farming images" ON storage.objects FOR SELECT USING (bucket_id = 'farming-images');
CREATE POLICY "Auth upload farming images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'farming-images');
CREATE POLICY "Auth delete farming images" ON storage.objects FOR DELETE USING (bucket_id = 'farming-images');
```

### Files to Modify
1. **`src/components/FarmingMethods.tsx`** -- Add category filters, expandable detail view, difficulty badges, search bar, realtime subscription, YouTube embed
2. **`src/components/admin/AdminContentManager.tsx`** -- Add new fields for farming_methods config, add image upload component for the farming_methods tab
3. **`src/integrations/supabase/types.ts`** -- Will auto-update after migration

### Realtime Implementation
In `FarmingMethods.tsx`, subscribe to postgres_changes on the `farming_methods` table and invalidate the react-query cache on any change, so the page refreshes automatically.

### Image Upload Flow
In the admin form, when the table is `farming_methods`:
- Show a file input instead of a text URL field
- On file select, upload to `farming-images` bucket
- Set the returned public URL as `image_url` on the item

