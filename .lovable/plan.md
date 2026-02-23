

# New Features: Crop Calendar, Mandi Locator, Feedback, Emergency Helpline

## Overview
We will add 4 new sections to the app: a Crop Calendar for AP/Telangana, a Mandi/Market Locator, a Farmer Feedback system (with voice, text, enquiry, and mobile number), and an Emergency Helpline directory with government numbers.

---

## 1. Crop Calendar / Seasonal Planner

A static, data-rich component showing month-by-month planting guides for major AP/Telangana crops.

**What farmers see:**
- Filter by crop type (Rice, Cotton, Chilli, Groundnut, Sugarcane, Maize, Turmeric, Redgram)
- Monthly timeline showing Sowing, Growing, and Harvesting windows
- Color-coded bars: Green = Sow, Yellow = Growing, Orange = Harvest
- Telugu labels and Speak button for each crop's info
- Region tags (AP / Telangana / Both)

**No database needed** -- crop calendar data is hardcoded since planting seasons are well-known and rarely change.

**New file:** `src/components/CropCalendar.tsx`

---

## 2. Mandi / Market Locator

A directory of agricultural markets (mandis) in AP and Telangana with contact info.

**What farmers see:**
- Filter by district or search by name
- Cards showing: Mandi name, district, address, phone number, crops they buy, opening hours
- Click-to-call phone number button
- Telugu translations for all labels

**Database table:** `mandis` -- pre-populated with ~15-20 major mandis from AP/Telangana

**New file:** `src/components/MandiLocator.tsx`

---

## 3. Farmer Feedback & Enquiry System

Farmers can submit voice or text feedback and enquiries. Admin sees all submissions in a new "Feedback" tab.

**What farmers see:**
- A new "Feedback" button in the feature grid
- Form with: Name (optional), Mobile Number, Message (text or voice input), Type (Feedback / Enquiry / Complaint)
- Voice record button that converts speech to text
- Speak button to hear confirmation

**What admin sees:**
- New "Feedback" tab in admin dashboard
- List of all submissions with name, mobile, message, type, date
- Status toggle (New / Read / Resolved)

**Database table:** `feedback` with columns: id, name, mobile, message, feedback_type, status, created_at

**New files:**
- `src/components/FarmerFeedback.tsx`
- Admin tab added to `AdminDashboard.tsx` and `AdminContentManager.tsx`

---

## 4. Emergency Helpline Directory

A quick-access page with government agricultural helpline numbers.

**What farmers see:**
- List of emergency numbers with click-to-call
- Categories: Agriculture Department, Pest Control, Animal Husbandry, Insurance, Weather Alerts, Police, Ambulance
- Includes: Kisan Call Center (1800-180-1551), AP Agriculture Dept, TS Agriculture Dept, PMFBY helpline, etc.
- Telugu labels with Speak button

**No database needed** -- static government numbers hardcoded.

**New file:** `src/components/EmergencyHelpline.tsx`

---

## Technical Details

### Database Migration

```sql
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
CREATE POLICY "Auth insert mandis" ON public.mandis FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update mandis" ON public.mandis FOR UPDATE USING (true);
CREATE POLICY "Auth delete mandis" ON public.mandis FOR DELETE USING (true);

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
CREATE POLICY "Auth read feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Auth update feedback" ON public.feedback FOR UPDATE USING (true);
CREATE POLICY "Auth delete feedback" ON public.feedback FOR DELETE USING (true);
```

### Pre-populated Mandi Data
Insert ~15 major mandis from AP/Telangana including:
- Guntur Mirchi Yard, Kurnool Market Yard, Ongole Market, Warangal Market Yard, Nizamabad Mandi, Karimnagar Market, Rajahmundry Market, Vijayawada Market Yard, etc.

### Files to Create
1. `src/components/CropCalendar.tsx` -- Month-by-month planting guide with crop filters
2. `src/components/MandiLocator.tsx` -- Mandi directory with search and click-to-call
3. `src/components/FarmerFeedback.tsx` -- Feedback/enquiry form with voice input
4. `src/components/EmergencyHelpline.tsx` -- Government helpline numbers

### Files to Modify
1. `src/components/FeatureGrid.tsx` -- Add 4 new feature buttons (Calendar, Mandi, Feedback, Helpline)
2. `src/pages/Index.tsx` -- Add routes for new sections in renderSection switch
3. `src/pages/AdminDashboard.tsx` -- Add "Feedback" tab
4. `src/components/admin/AdminContentManager.tsx` -- Add feedback field config (read-only view with status toggle)

### Feature Grid New Buttons
- Calendar: emoji "🗓", color teal
- Mandi: emoji "📍", color orange  
- Feedback: emoji "📝", color indigo
- Helpline: emoji "🆘", color red

### Emergency Numbers (hardcoded)
- Kisan Call Center: 1800-180-1551
- AP Agriculture Helpline: 1800-425-1110
- TS Agriculture Helpline: 1800-599-5559
- PMFBY Insurance: 1800-200-7710
- Animal Husbandry: 1962
- Police: 100
- Ambulance: 108
- Fire: 101
- Women Helpline: 181

