-- ===========================================================================
-- DentaCare Clinic — Supabase schema
--
-- Run this once in the Supabase SQL editor, then add these to your Vite env
-- (Settings → Environment in Freebuff, or .env.local for local development):
--
--   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
--   VITE_SUPABASE_ANON_KEY=<anon public key>
--
-- The website and the /admin dashboard then use Postgres instead of the
-- browser demo store. No application code changes are required.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  duration text not null default '',
  price_from integer not null default 0,
  icon text not null default 'tooth',
  highlights jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id text primary key,
  name text not null,
  role text not null default '',
  specialties jsonb not null default '[]'::jsonb,
  bio text not null default '',
  experience_years integer not null default 0,
  education jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  tone text not null default 'teal',
  published boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  patient_name text not null,
  city text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null default '',
  service text not null default '',
  date date not null default current_date,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id text primary key,
  full_name text not null,
  phone text not null,
  email text not null,
  service_id text,
  service_name text not null default '',
  preferred_date date not null,
  preferred_time text not null,
  message text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Single-row table holding every editable piece of website copy.
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists appointments_preferred_date_idx on public.appointments (preferred_date desc);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists services_sort_idx on public.services (sort_order);
create index if not exists doctors_sort_idx on public.doctors (sort_order);
create index if not exists testimonials_date_idx on public.testimonials (date desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Visitors may read the public website content and submit a booking request.
-- Signed-in staff (Supabase Auth users) get full read/write access, which is
-- what the /admin dashboard uses.
-- ---------------------------------------------------------------------------

alter table public.services enable row level security;
alter table public.doctors enable row level security;
alter table public.testimonials enable row level security;
alter table public.appointments enable row level security;
alter table public.site_content enable row level security;

do $$
begin
  -- Public, read-only access to published website content
  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'published services are public') then
    create policy "published services are public" on public.services
      for select using (published = true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'doctors' and policyname = 'published doctors are public') then
    create policy "published doctors are public" on public.doctors
      for select using (published = true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'testimonials' and policyname = 'approved testimonials are public') then
    create policy "approved testimonials are public" on public.testimonials
      for select using (approved = true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'site_content' and policyname = 'site content is public') then
    create policy "site content is public" on public.site_content
      for select using (true);
  end if;

  -- Anyone may submit a booking request; nobody anonymous may read them back
  if not exists (select 1 from pg_policies where tablename = 'appointments' and policyname = 'anyone can request an appointment') then
    create policy "anyone can request an appointment" on public.appointments
      for insert with check (true);
  end if;

  -- Practice staff (authenticated users) manage everything
  if not exists (select 1 from pg_policies where tablename = 'appointments' and policyname = 'staff manage appointments') then
    create policy "staff manage appointments" on public.appointments
      for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'staff manage services') then
    create policy "staff manage services" on public.services
      for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'doctors' and policyname = 'staff manage doctors') then
    create policy "staff manage doctors" on public.doctors
      for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'testimonials' and policyname = 'staff manage testimonials') then
    create policy "staff manage testimonials" on public.testimonials
      for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'site_content' and policyname = 'staff manage site content') then
    create policy "staff manage site content" on public.site_content
      for all to authenticated using (true) with check (true);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Starter content (fictional - replace with the real practice details)
-- ---------------------------------------------------------------------------

insert into public.services (id, slug, name, tagline, description, duration, price_from, icon, highlights, featured, published, sort_order)
values
  ('svc_implants', 'dental-implants', 'Dental Implants',
   'Permanent replacements that look and feel like your own teeth',
   'A dental implant replaces the root of a missing tooth with a titanium post, topped by a hand-crafted ceramic crown. Guided surgery keeps placement precise, quick and comfortable.',
   '2 visits · 90 min each', 1250, 'implant',
   '["Digital 3D scan and guided placement","Same-day temporary crown available","10-year implant warranty"]'::jsonb,
   true, true, 1),
  ('svc_whitening', 'teeth-whitening', 'Teeth Whitening',
   'A visibly brighter smile in a single lunch break',
   'Professional in-chair whitening lifts years of coffee, tea and wine staining in about an hour, with enamel-safe gel calibrated to your natural shade.',
   '1 visit · 60 min', 349, 'whitening',
   '["Up to 8 shades brighter in one session","Desensitising formula","Take-home maintenance kit included"]'::jsonb,
   true, true, 2),
  ('svc_orthodontics', 'orthodontics', 'Orthodontics',
   'Straighten your teeth discreetly — at any age',
   'From clear aligners to ceramic braces, our orthodontists build a movement plan around your face, not just your bite.',
   'Monthly check-ups · 45 min', 2450, 'orthodontics',
   '["Invisalign and ceramic brace options","Digital smile simulation","Retainers included"]'::jsonb,
   true, true, 3),
  ('svc_cosmetic', 'cosmetic-dentistry', 'Cosmetic Dentistry',
   'Veneers, bonding and reshaping with an editorial eye',
   'Ultra-thin porcelain veneers and composite bonding repair chips, close gaps and even out colour while keeping the character of your natural teeth.',
   '2–3 visits · 60 min', 420, 'cosmetic',
   '["Hand-layered porcelain veneers","Same-day composite bonding","Minimal or no enamel removal"]'::jsonb,
   true, true, 4),
  ('svc_cleaning', 'dental-cleaning', 'Dental Cleaning',
   'Preventive care that keeps small problems small',
   'Ultrasonic scaling, gentle air polishing, a fluoride finish and a personalised home-care plan.',
   '1 visit · 30–45 min', 65, 'cleaning',
   '["Ultrasonic scaling and air polishing","Gum health screening","Stain removal"]'::jsonb,
   false, true, 5),
  ('svc_pediatric', 'pediatric-dentistry', 'Pediatric Dentistry',
   'First visits that children actually look forward to',
   'A playful pediatric room, a no-drill policy for check-ups and a team trained to work at a child''s pace.',
   '1 visit · 30 min', 45, 'pediatric',
   '["Child-scaled treatment room","Free first check-up for under 6s","Fluoride and sealants"]'::jsonb,
   false, true, 6),
  ('svc_root-canal', 'root-canal-therapy', 'Root Canal Therapy',
   'Save the tooth, keep the comfort',
   'Microscope-assisted rotary endodontics removes infection while preserving the natural tooth, usually in a single visit.',
   '1–2 visits · 75 min', 320, 'rootcanal',
   '["Microscope-assisted precision","Single-visit treatment in most cases","Crown planning included"]'::jsonb,
   false, true, 7),
  ('svc_emergency', 'emergency-dental-care', 'Emergency Dental Care',
   'Same-day relief for pain, chips and lost crowns',
   'Two emergency slots are kept open every weekday plus a Saturday morning line for urgent cases.',
   'Same day · 30 min', 95, 'emergency',
   '["Same-day appointments before 10:00","Temporary repairs","Direct referral for complex trauma"]'::jsonb,
   false, true, 8)
on conflict (id) do nothing;

insert into public.doctors (id, name, role, specialties, bio, experience_years, education, languages, tone, published, sort_order)
values
  ('doc_vermeer', 'Dr. Anna Vermeer', 'Founder & Implantologist',
   '["Implantology","Oral surgery","Bone grafting"]'::jsonb,
   'Anna founded DentaCare in 2011 after a decade in hospital maxillofacial surgery and teaches guided implantology to postgraduate dentists.',
   19, '["DDS, University of Amsterdam","MSc Implantology, ACTA Amsterdam"]'::jsonb,
   '["Dutch","English","German"]'::jsonb, 'teal', true, 1),
  ('doc_fontaine', 'Dr. Lucas Fontaine', 'Orthodontist',
   '["Invisalign","Ceramic braces","Growth guidance"]'::jsonb,
   'Lucas treats teenagers and adults who were told aligners would not work for them, planning every case digitally first.',
   13, '["DDS, Université Paris Cité","MSc Orthodontics, University of Groningen"]'::jsonb,
   '["Dutch","English","French"]'::jsonb, 'blue', true, 2),
  ('doc_marchetti', 'Dr. Sofia Marchetti', 'Cosmetic & Restorative Dentist',
   '["Porcelain veneers","Composite bonding","Smile design"]'::jsonb,
   'Sofia leads our smile design studio and treats every veneer as a small piece of craft.',
   12, '["DDS, University of Bologna","Advanced Aesthetic Dentistry, Geneva"]'::jsonb,
   '["Dutch","English","Italian"]'::jsonb, 'mint', true, 3),
  ('doc_osei', 'Dr. Daniel Osei', 'Pediatric Dentist',
   '["Child behaviour guidance","Preventive care","Sealants"]'::jsonb,
   'Daniel turns nervous first visits into high fives and runs our school outreach programme.',
   10, '["DDS, University of Ghana","MSc Paediatric Dentistry, ACTA Amsterdam"]'::jsonb,
   '["English","Dutch"]'::jsonb, 'sand', true, 4),
  ('doc_yilmaz', 'Selin Yılmaz', 'Lead Dental Hygienist',
   '["Periodontal therapy","Air polishing","Prevention coaching"]'::jsonb,
   'Selin looks after our patients'' gum health and runs the six-month reminder programme.',
   8, '["BSc Dental Hygiene, Hogeschool Utrecht"]'::jsonb,
   '["Dutch","English","Turkish"]'::jsonb, 'sky', true, 5)
on conflict (id) do nothing;

insert into public.testimonials (id, patient_name, city, rating, quote, service, date, approved)
values
  ('tst_marieke', 'Marieke Jansen', 'Amsterdam', 5,
   'I avoided dentists for eleven years. Within one appointment the team had a plan, a price and zero judgement.',
   'Dental Implants', '2026-08-19', true),
  ('tst_thomas', 'Thomas Berger', 'Amstelveen', 5,
   'Clear aligners sorted out the crowding I have hated since I was fifteen. The digital preview was scarily accurate.',
   'Orthodontics', '2026-07-02', true),
  ('tst_fatima', 'Fatima El Amrani', 'Haarlem', 5,
   'My son used to cry in the car park. Now he asks when we are going back to see Dr. Osei.',
   'Pediatric Dentistry', '2026-06-24', true),
  ('tst_bram', 'Bram de Vries', 'Utrecht', 5,
   'Broken front tooth on a Saturday morning before a wedding. Forty minutes later nobody could spot the repair.',
   'Emergency Dental Care', '2026-05-30', true),
  ('tst_lena', 'Lena Kowalski', 'Amsterdam', 5,
   'The whitening result looks like my own teeth, just five years younger. No sensitivity at all.',
   'Teeth Whitening', '2026-04-11', true),
  ('tst_jonas', 'Jonas Meijer', 'Diemen', 4,
   'Excellent clinical work and honest pricing — they talked me out of a treatment I did not need.',
   'Cosmetic Dentistry', '2026-03-08', true)
on conflict (id) do nothing;

insert into public.site_content (id, data)
values (
  'main',
  '{
    "brand": { "name": "DentaCare Clinic", "tagline": "Modern dentistry in the heart of Amsterdam", "established": "2011" },
    "hero": {
      "eyebrow": "Amsterdam · Since 2011",
      "headline": "Your Smile.",
      "highlight": "Our Expertise.",
      "subheadline": "Six specialists, one calm clinic and a plan built around your teeth. From a routine clean to full implant reconstruction, we combine digital diagnostics with genuinely gentle care.",
      "primaryCta": "Book an Appointment",
      "secondaryCta": "Our Services",
      "note": "No waiting lists · Evening and Saturday appointments · All major insurers accepted"
    },
    "about": {
      "lead": "DentaCare Clinic was founded on a simple observation: people do not fear dentistry, they fear being rushed, surprised by a bill or talked over.",
      "story": [
        "We opened our doors on the Keizersgracht in 2011 with two treatment rooms and a second-hand X-ray machine. Today DentaCare is a six-specialist clinic with in-house 3D imaging and a digital laboratory.",
        "Every new patient starts with a 45-minute diagnostic appointment: full imaging, a conversation about what actually bothers you, and a written plan with fixed prices."
      ],
      "values": [
        { "id": "val_1", "title": "Unhurried by design", "description": "Longer appointment slots and fewer patients per day.", "icon": "clock" },
        { "id": "val_2", "title": "Prices agreed up front", "description": "A written treatment plan with fixed prices before we begin.", "icon": "wallet" },
        { "id": "val_3", "title": "Technology that earns its keep", "description": "3D CBCT, intraoral scanning and in-house milling.", "icon": "microscope" }
      ],
      "milestones": [
        { "id": "ms_1", "year": "2011", "title": "Two rooms on the Keizersgracht", "description": "DentaCare opens with Dr. Vermeer and one dental nurse." },
        { "id": "ms_2", "year": "2015", "title": "In-house 3D imaging", "description": "One of the first Amsterdam practices with a CBCT scanner on site." }
      ],
      "accreditations": [
        "KNMT registered practice",
        "ISO 13485 sterilisation protocol",
        "Invisalign Diamond Provider",
        "Recognised training practice (ACTA)"
      ]
    },
    "stats": [
      { "id": "st_1", "value": "9,400+", "label": "patients in long-term care" },
      { "id": "st_2", "value": "4.9/5", "label": "from 1,240 reviews" },
      { "id": "st_3", "value": "15", "label": "years on the Keizersgracht" },
      { "id": "st_4", "value": "24h", "label": "emergency response time" }
    ],
    "trust": ["KNMT registered", "ISO-certified sterilisation", "All major insurers accepted", "Same-day emergency slots"],
    "reasons": [
      { "id": "why_1", "title": "Digital-first diagnostics", "description": "A 3D scan, intraoral camera and digital impressions in one appointment.", "icon": "scan" },
      { "id": "why_2", "title": "Pain-free, anxiety-friendly", "description": "Numbing gel, sedation options and a stop-signal we always honour.", "icon": "heart" },
      { "id": "why_3", "title": "Transparent pricing", "description": "Fixed prices, direct billing with most insurers and instalment plans.", "icon": "wallet" },
      { "id": "why_4", "title": "One team for the family", "description": "Pediatric care, hygiene, orthodontics, cosmetics and implantology under one roof.", "icon": "users" },
      { "id": "why_5", "title": "In the centre of Amsterdam", "description": "Two minutes from tram 4 and metro 52, with evening and Saturday slots.", "icon": "pin" },
      { "id": "why_6", "title": "Multilingual team", "description": "Consultations in Dutch, English, German, French, Italian and Turkish.", "icon": "languages" }
    ],
    "clinic": {
      "name": "DentaCare Clinic",
      "phone": "+31 20 123 4567",
      "whatsapp": "+31 6 1234 5678",
      "email": "hello@dentacare-clinic.com",
      "street": "Keizersgracht 128",
      "postalCode": "1015 CW",
      "city": "Amsterdam",
      "country": "Netherlands",
      "mapsQuery": "Keizersgracht 128, 1015 CW Amsterdam",
      "hours": [
        { "id": "hr_1", "day": "Monday", "hours": "08:00 – 18:00" },
        { "id": "hr_2", "day": "Tuesday", "hours": "08:00 – 18:00" },
        { "id": "hr_3", "day": "Wednesday", "hours": "08:00 – 20:00" },
        { "id": "hr_4", "day": "Thursday", "hours": "08:00 – 18:00" },
        { "id": "hr_5", "day": "Friday", "hours": "08:00 – 17:00" },
        { "id": "hr_6", "day": "Saturday", "hours": "10:00 – 14:00 (by appointment)" },
        { "id": "hr_7", "day": "Sunday", "hours": "Closed" }
      ],
      "socials": [
        { "id": "so_1", "label": "Instagram", "href": "https://instagram.com" },
        { "id": "so_2", "label": "Facebook", "href": "https://facebook.com" },
        { "id": "so_3", "label": "LinkedIn", "href": "https://linkedin.com" }
      ],
      "emergencyNote": "Dental emergency? Call us before 10:00 and we will almost always see you the same day."
    },
    "gallery": [
      { "id": "gal_1", "title": "Reception & waiting lounge", "caption": "Calm, daylight-filled entrance with herbal tea on request.", "category": "Clinic", "tone": "teal", "motif": "clinic" },
      { "id": "gal_2", "title": "Treatment room one", "caption": "Ceiling-mounted screen and noise-cancelling headphones.", "category": "Clinic", "tone": "blue", "motif": "treatment" },
      { "id": "gal_3", "title": "3D imaging suite", "caption": "CBCT scanner and intraoral scanning station.", "category": "Technology", "tone": "ink", "motif": "technology" },
      { "id": "gal_4", "title": "Children's room", "caption": "Pediatric room with ceiling projector and floor cushions.", "category": "Clinic", "tone": "sand", "motif": "kids" },
      { "id": "gal_5", "title": "Digital laboratory", "caption": "In-house milling unit for same-day ceramic crowns.", "category": "Technology", "tone": "mint", "motif": "technology" },
      { "id": "gal_6", "title": "Whitening consultation", "caption": "Shade calibration before every whitening session.", "category": "Treatments", "tone": "sky", "motif": "smile" }
    ],
    "beforeAfter": [
      { "id": "ba_1", "treatment": "Composite bonding, upper front four", "duration": "1 visit · 90 minutes", "summary": "Worn edges and a gap closed with hand-layered composite. No enamel removal required.", "tone": "teal" },
      { "id": "ba_2", "treatment": "Clear aligner therapy", "duration": "11 months", "summary": "Crowded lower arch and an anterior crossbite corrected with 24 aligner sets.", "tone": "blue" },
      { "id": "ba_3", "treatment": "Implant and ceramic crown", "duration": "4 months end-to-end", "summary": "Left first molar replaced with a guided implant and a milled zirconia crown.", "tone": "mint" },
      { "id": "ba_4", "treatment": "Professional whitening", "duration": "1 visit · 60 minutes", "summary": "Seven shades lifted in a single session with a take-home maintenance kit.", "tone": "sky" }
    ],
    "faqs": [
      { "id": "faq_1", "question": "How do I book an appointment?", "answer": "Request a slot through the booking form, call us or send a WhatsApp message. Our patient care team confirms every request within one working day." },
      { "id": "faq_2", "question": "Do you accept dental insurance?", "answer": "We work with all major Dutch insurers and bill them directly for covered treatment." },
      { "id": "faq_3", "question": "I am nervous about the dentist — what can you do?", "answer": "Longer appointments, numbing gel before injections, sedation options and a stop-signal we always respect." },
      { "id": "faq_4", "question": "How long does a dental implant take?", "answer": "Placement takes about an hour; healing before the final crown is usually 8 to 12 weeks." },
      { "id": "faq_5", "question": "Can I get an emergency appointment today?", "answer": "We keep two slots open every weekday for urgent cases. Call before 10:00 and we will almost always see you the same day." },
      { "id": "faq_6", "question": "From what age should my child see a dentist?", "answer": "From the appearance of the first tooth, and definitely by their second birthday. First check-ups are free under six." }
    ],
    "finalCta": {
      "headline": "Ready to meet your new dental team?",
      "description": "Book a first appointment and we will take the time to understand your teeth, your history and what you actually want. No pressure, no upselling, no surprise invoices.",
      "note": "First consultations are 45 minutes and include full digital imaging."
    },
    "footerNote": "Demo website. All doctors, patients, reviews and contact details are fictional."
  }'::jsonb
)
on conflict (id) do nothing;
