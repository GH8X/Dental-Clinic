# DentaCare Clinic — premium dental practice website

A complete, production-shaped marketing website for a fictional dental clinic, built to the standard of a
€500–€1,000+ client project: seven public pages, a WhatsApp-enabled booking flow that writes real records, and a
password-protected admin dashboard where the practice team manages everything themselves.

Everything you see is fictional — doctors, patients, reviews, prices and contact details are invented for the demo.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (custom clinical palette, no UI kit defaults) |
| Motion | Framer Motion (scroll reveals, slide-over panels, accordions) |
| Icons | lucide-react |
| Routing | React Router 6 |
| Data | Supabase-ready adapter layer (Postgres + RLS), with a browser demo store by default |

## Getting started

```bash
bun install
bun run dev        # http://localhost:5173
bun run typecheck  # tsc -b --noEmit
bun run build      # typecheck + static build into dist/
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero (“Your Smile. Our Expertise.”), trust indicators, featured treatments, why-choose-us, team, before/after sliders, testimonials, FAQ, closing CTA |
| `/about` | Practice story, values, milestones timeline, accreditations, team preview |
| `/services` | All treatments, four-step treatment process, pricing and insurance band, FAQs |
| `/services/:slug` | Per-treatment page with inclusions, visit walkthrough, price, related treatments |
| `/doctors` | Clinician profiles (specialities, training, languages) and the support team |
| `/gallery` | Filterable clinic photography slots plus four before/after comparison sliders |
| `/contact` | Contact cards, opening hours, map link, validated enquiry form, FAQs |
| `/appointment` | Full booking form with validation, confirmation screen and WhatsApp hand-off |
| `/admin` | Dashboard: overview, appointments, services, doctors, testimonials, website content |

### Admin dashboard

Sign in at `/admin` with the demo credentials shown on the sign-in screen:

```
Email:    admin@dentacare-clinic.com
Password: dentacare
```

The session is held in `sessionStorage`. The dashboard can add, edit and delete appointments, treatments, doctor
profiles and reviews, toggle what is published, and rewrite the homepage copy, contact details, opening hours,
statistics, FAQs and gallery captions. Every change is reflected on the public site immediately.

## Data architecture (Supabase-ready)

The UI never talks to a database directly. Every read and write goes through one narrow interface:

```
src/lib/api/adapter.ts   → DataAdapter contract (the only thing components know about)
src/lib/api/local.ts     → demo store: seeded fictional content persisted in localStorage
src/lib/api/supabase.ts  → Postgres implementation via the official Supabase client
src/lib/api/index.ts     → resolveAdapter(): picks Supabase when env keys exist, else the demo store
src/lib/data-context.tsx → React provider + useData() hooks used by every page
supabase/schema.sql      → tables, RLS policies and starter content
```

Swapping backends is a configuration change, not a refactor.

### Run it on Supabase

1. Create a project at [supabase.com](https://supabase.com) — the free tier is enough.
2. Open the SQL editor and run `supabase/schema.sql` (creates `services`, `doctors`, `testimonials`, `appointments`,
   `site_content`, row-level security policies and starter content).
3. Add these two environment variables in **Settings → Environment** (or `.env.local` locally):

   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon public key>
   ```

4. Reload. The site, the booking form and the dashboard now read and write Postgres; the dashboard badge switches
   from “Demo mode” to “Supabase”.

Row-level security is set up so anonymous visitors can read published content and submit a booking request, while
only authenticated staff can read patient data or change anything. Add practice team accounts under
Authentication → Users; the dashboard can then be gated with Supabase Auth in place of the demo passcode.

## Replacing the photography

Real photography is expected to replace the illustrated slots. Each placeholder accepts a `src` and falls back to the
themed illustration if the image fails to load:

```tsx
<PhotoFrame tone="teal" motif="smile" aspect="tall" src="/images/smile-studio.jpg" label="Smile design studio" />
<DoctorPortrait name={doctor.name} tone={doctor.tone} src={doctor.photoUrl} />
```

`motif` picks the illustration (`clinic`, `treatment`, `smile`, `team`, `technology`, `kids`, `portrait`) and `tone`
picks the duotone palette (`teal`, `blue`, `mint`, `sand`, `sky`, `ink`). Doctor portraits also support a URL.

## Booking and WhatsApp

The booking form validates client-side (name, phone, email, date not in the past, Sundays closed), writes a
`pending` appointment through the adapter, then shows a confirmation with a reference number and a pre-filled
WhatsApp deep link. A floating WhatsApp button is available on every page, using the number configured in
Website content → Practice details.

## Content notes

- All copy, prices, treatments, clinicians, reviews and contact details are fictional demo content.
- The enquiry form on `/contact` validates and confirms locally; connect it to a transactional email service or the
  `appointments`/`messages` table to receive real messages.
- `public/_redirects` adds an SPA fallback so deep links work on static hosts that support it.
