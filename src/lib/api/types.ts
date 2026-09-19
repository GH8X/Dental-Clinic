/**
 * Domain model for the DentaCare Clinic website.
 *
 * These types are intentionally backend-agnostic: the UI only ever talks to the
 * `DataAdapter` abstraction in this folder, so the demo (local) storage can be
 * swapped for Supabase - or any other provider - without touching components.
 */

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AppointmentInput {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  priceFrom: number;
  icon: string;
  highlights: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  experienceYears: number;
  education: string[];
  languages: string[];
  tone: Tone;
  published: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  patientName: string;
  city: string;
  rating: number;
  quote: string;
  service: string;
  date: string;
  approved: boolean;
}

export type Tone = "teal" | "blue" | "mint" | "sand" | "sky" | "ink";

/** Illustrated motifs available to the photography placeholders. */
export type Motif = "clinic" | "treatment" | "smile" | "team" | "technology" | "kids" | "portrait";

export interface PhotoMeta {
  id: string;
  title: string;
  caption: string;
  category: string;
  tone: Tone;
  motif: Motif;
  createdAt?: string;
}

export interface BeforeAfterCase {
  id: string;
  treatment: string;
  duration: string;
  summary: string;
  tone: Tone;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface ReasonItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface OpeningHour {
  id: string;
  day: string;
  hours: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
    established: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    highlight: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
  };
  about: {
    lead: string;
    story: string[];
    values: ReasonItem[];
    milestones: Milestone[];
    accreditations: string[];
  };
  stats: StatItem[];
  trust: string[];
  reasons: ReasonItem[];
  clinic: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    mapsQuery: string;
    hours: OpeningHour[];
    socials: SocialLink[];
    emergencyNote: string;
  };
  gallery: PhotoMeta[];
  beforeAfter: BeforeAfterCase[];
  faqs: FaqItem[];
  finalCta: {
    headline: string;
    description: string;
    note: string;
  };
  footerNote: string;
}

export interface Database {
  services: Service[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  appointments: Appointment[];
  content: SiteContent;
}

export const TONE_CLASSES: Record<Tone, { panel: string; ring: string; text: string }> = {
  teal: { panel: "from-brand-100 via-brand-50 to-white", ring: "ring-brand-200", text: "text-brand-700" },
  blue: { panel: "from-accent-100 via-accent-50 to-white", ring: "ring-accent-200", text: "text-accent-700" },
  mint: { panel: "from-emerald-50 via-brand-50 to-white", ring: "ring-brand-200", text: "text-brand-700" },
  sand: { panel: "from-amber-50 via-orange-50 to-white", ring: "ring-amber-200", text: "text-amber-700" },
  sky: { panel: "from-sky-50 via-accent-50 to-white", ring: "ring-accent-200", text: "text-accent-700" },
  ink: { panel: "from-ink-50 via-ink-50 to-white", ring: "ring-ink-200", text: "text-ink-700" },
};
