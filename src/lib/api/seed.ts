import type { Appointment, Database, Doctor, Service, SiteContent, Testimonial } from "./types";

/** Date helper so the demo data always sits in the near future. */
function isoInDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isoHoursAgo(hours: number) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

export const seedServices: Service[] = [
  {
    id: "svc_implants",
    slug: "dental-implants",
    name: "Dental Implants",
    tagline: "Permanent replacements that look and feel like your own teeth",
    description:
      "A dental implant replaces the root of a missing tooth with a titanium post, topped by a hand-crafted ceramic crown. Using 3D CBCT scanning and guided surgery, we plan every millimetre before we begin, so placement is precise, quick and remarkably comfortable.",
    duration: "2 visits · 90 min each",
    priceFrom: 1250,
    icon: "implant",
    highlights: [
      "Digital 3D scan and guided placement",
      "Same-day temporary crown available",
      "10-year implant warranty",
      "Interest-free instalment plans",
    ],
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "svc_whitening",
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    tagline: "A visibly brighter smile in a single lunch break",
    description:
      "Professional in-chair whitening lifts years of coffee, tea and wine staining in about an hour. We protect your gums, calibrate the gel to your enamel and match the result to your skin tone, so the finish looks natural rather than fluorescent.",
    duration: "1 visit · 60 min",
    priceFrom: 349,
    icon: "whitening",
    highlights: [
      "Up to 8 shades brighter in one session",
      "Enamel-safe, desensitising formula",
      "Take-home maintenance kit included",
      "Free shade assessment",
    ],
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: "svc_orthodontics",
    slug: "orthodontics",
    name: "Orthodontics",
    tagline: "Straighten your teeth discreetly — at any age",
    description:
      "From clear aligners to ceramic braces, our orthodontists build a movement plan around your face, not just your bite. We preview the final result digitally before you commit, and most adult cases finish within 9 to 14 months.",
    duration: "Monthly check-ups · 45 min",
    priceFrom: 2450,
    icon: "orthodontics",
    highlights: [
      "Invisalign and ceramic brace options",
      "Digital smile simulation before you start",
      "Retainers and aftercare included",
      "Adult and teen treatment plans",
    ],
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: "svc_cosmetic",
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    tagline: "Veneers, bonding and reshaping with an editorial eye",
    description:
      "We design smiles the way a studio designs a cover: proportion, symmetry and light. Ultra-thin porcelain veneers and composite bonding repair chips, close gaps and even out colour while keeping the character of your natural teeth.",
    duration: "2–3 visits · 60 min",
    priceFrom: 420,
    icon: "cosmetic",
    highlights: [
      "Hand-layered porcelain veneers",
      "Same-day composite bonding",
      "Wax-up preview of your new smile",
      "Minimal or no enamel removal",
    ],
    featured: true,
    published: true,
    order: 4,
  },
  {
    id: "svc_cleaning",
    slug: "dental-cleaning",
    name: "Dental Cleaning",
    tagline: "Preventive care that keeps small problems small",
    description:
      "A thorough hygiene appointment: ultrasonic removal of plaque and tartar, gentle air polishing, a fluoride finish and a personalised home-care plan. It is the single most cost-effective treatment we offer.",
    duration: "1 visit · 30–45 min",
    priceFrom: 65,
    icon: "cleaning",
    highlights: [
      "Ultrasonic scaling and air polishing",
      "Gum health and pocket screening",
      "Stain removal for coffee and tobacco",
      "Reminder programme every 6 months",
    ],
    featured: false,
    published: true,
    order: 5,
  },
  {
    id: "svc_pediatric",
    slug: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    tagline: "First visits that children actually look forward to",
    description:
      "Our pediatric room has a ceiling projector, a no-drill policy for check-ups and a team trained to work at a child's pace. We focus on prevention, sealants and building habits that last a lifetime.",
    duration: "1 visit · 30 min",
    priceFrom: 45,
    icon: "pediatric",
    highlights: [
      "Playful, child-scaled treatment room",
      "Free first check-up for under 6s",
      "Fluoride, sealants and mouthguards",
      "Parents stay in the room",
    ],
    featured: false,
    published: true,
    order: 6,
  },
  {
    id: "svc_root-canal",
    slug: "root-canal-therapy",
    name: "Root Canal Therapy",
    tagline: "Save the tooth, keep the comfort",
    description:
      "Modern rotary endodontics with microscope magnification removes infection while preserving your natural tooth. Most cases are completed in one visit under effective local anaesthesia — no more dreaded drill-and-fill marathon.",
    duration: "1–2 visits · 75 min",
    priceFrom: 320,
    icon: "rootcanal",
    highlights: [
      "Microscope-assisted precision",
      "Single-visit treatment in most cases",
      "Painless anaesthetic protocol",
      "Crown planning included",
    ],
    featured: false,
    published: true,
    order: 7,
  },
  {
    id: "svc_emergency",
    slug: "emergency-dental-care",
    name: "Emergency Dental Care",
    tagline: "Same-day relief for pain, chips and lost crowns",
    description:
      "We keep two emergency slots open every weekday and a Saturday morning line for urgent cases. Call before 10:00 and we will almost always see you the same day, including temporary repairs and pain management.",
    duration: "Same day · 30 min",
    priceFrom: 95,
    icon: "emergency",
    highlights: [
      "Same-day appointments before 10:00",
      "Saturday morning emergency line",
      "Temporary repairs and re-cementing",
      "Direct referral for complex trauma",
    ],
    featured: false,
    published: true,
    order: 8,
  },
];

export const seedDoctors: Doctor[] = [
  {
    id: "doc_vermeer",
    name: "Dr. Anna Vermeer",
    role: "Founder & Implantologist",
    specialties: ["Implantology", "Oral surgery", "Bone grafting"],
    bio: "Anna founded DentaCare in 2011 after a decade in hospital maxillofacial surgery. She has placed more than 4,000 implants and teaches guided implantology to postgraduate dentists across the Netherlands.",
    experienceYears: 19,
    education: ["DDS, University of Amsterdam", "MSc Implantology, ACTA Amsterdam"],
    languages: ["Dutch", "English", "German"],
    tone: "teal",
    published: true,
    order: 1,
  },
  {
    id: "doc_fontaine",
    name: "Dr. Lucas Fontaine",
    role: "Orthodontist",
    specialties: ["Invisalign", "Ceramic braces", "Growth guidance"],
    bio: "Lucas treats teenagers and adults who were told aligners would not work for them. He is an Invisalign Diamond provider and plans every case with a digital movement simulation before the first aligner is worn.",
    experienceYears: 13,
    education: ["DDS, Université Paris Cité", "MSc Orthodontics, University of Groningen"],
    languages: ["Dutch", "English", "French"],
    tone: "blue",
    published: true,
    order: 2,
  },
  {
    id: "doc_marchetti",
    name: "Dr. Sofia Marchetti",
    role: "Cosmetic & Restorative Dentist",
    specialties: ["Porcelain veneers", "Composite bonding", "Smile design"],
    bio: "Sofia comes from a ceramics workshop in Bologna and treats every veneer as a small piece of craft. She leads our smile design studio and is happiest when a patient cannot tell where their tooth ends and hers begins.",
    experienceYears: 12,
    education: ["DDS, University of Bologna", "Advanced Aesthetic Dentistry, Geneva"],
    languages: ["Dutch", "English", "Italian"],
    tone: "mint",
    published: true,
    order: 3,
  },
  {
    id: "doc_osei",
    name: "Dr. Daniel Osei",
    role: "Pediatric Dentist",
    specialties: ["Child behaviour guidance", "Preventive care", "Sealants"],
    bio: "Daniel has a gift for turning nervous first visits into high fives. He runs our school outreach programme and is a certified provider of nitrous oxide sedation for anxious young patients.",
    experienceYears: 10,
    education: ["DDS, University of Ghana", "MSc Paediatric Dentistry, ACTA Amsterdam"],
    languages: ["English", "Dutch"],
    tone: "sand",
    published: true,
    order: 4,
  },
  {
    id: "doc_yilmaz",
    name: "Selin Yılmaz",
    role: "Lead Dental Hygienist",
    specialties: ["Periodontal therapy", "Air polishing", "Prevention coaching"],
    bio: "Selin looks after the health of our patients' gums and is the reason most of them never need anything else. She runs our six-month reminder programme and our stop-smoking support clinic.",
    experienceYears: 8,
    education: ["BSc Dental Hygiene, Hogeschool Utrecht"],
    languages: ["Dutch", "English", "Turkish"],
    tone: "sky",
    published: true,
    order: 5,
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "tst_marieke",
    patientName: "Marieke Jansen",
    city: "Amsterdam",
    rating: 5,
    quote:
      "I avoided dentists for eleven years. Within one appointment the team had a plan, a price and zero judgement. My implant was placed without a single moment of pain.",
    service: "Dental Implants",
    date: "2026-08-19",
    approved: true,
  },
  {
    id: "tst_thomas",
    patientName: "Thomas Berger",
    city: "Amstelveen",
    rating: 5,
    quote:
      "Clear aligners sorted out the crowding I have hated since I was fifteen. The digital preview was scarily accurate — the final result is exactly what they showed me in month one.",
    service: "Orthodontics",
    date: "2026-07-02",
    approved: true,
  },
  {
    id: "tst_fatima",
    patientName: "Fatima El Amrani",
    city: "Haarlem",
    rating: 5,
    quote:
      "My son used to cry in the car park. Now he asks when we are going back to see Dr. Osei. The children's room with the ceiling projector is genius.",
    service: "Pediatric Dentistry",
    date: "2026-06-24",
    approved: true,
  },
  {
    id: "tst_bram",
    patientName: "Bram de Vries",
    city: "Utrecht",
    rating: 5,
    quote:
      "I came in on a Saturday morning with a broken front tooth before a wedding. Forty minutes later I walked out with a composite repair nobody can spot in photos.",
    service: "Emergency Dental Care",
    date: "2026-05-30",
    approved: true,
  },
  {
    id: "tst_lena",
    patientName: "Lena Kowalski",
    city: "Amsterdam",
    rating: 5,
    quote:
      "The whitening result looks like my own teeth, just five years younger. No sensitivity at all, and the take-home kit keeps it that way.",
    service: "Teeth Whitening",
    date: "2026-04-11",
    approved: true,
  },
  {
    id: "tst_jonas",
    patientName: "Jonas Meijer",
    city: "Diemen",
    rating: 4,
    quote:
      "Excellent clinical work and honest pricing — they talked me out of a treatment I did not need. Only wish the Wednesday evening slots booked up less quickly.",
    service: "Cosmetic Dentistry",
    date: "2026-03-08",
    approved: true,
  },
];

export const seedAppointments: Appointment[] = [
  {
    id: "apt_1041",
    fullName: "Sanne de Boer",
    phone: "+31 6 2145 8890",
    email: "sanne.deboer@example.com",
    serviceId: "svc_cleaning",
    serviceName: "Dental Cleaning",
    preferredDate: isoInDays(2),
    preferredTime: "09:30",
    message: "Six-month check-up, no complaints.",
    status: "confirmed",
    createdAt: isoHoursAgo(30),
  },
  {
    id: "apt_1042",
    fullName: "Murat Kaya",
    phone: "+31 6 3345 1120",
    email: "m.kaya@example.com",
    serviceId: "svc_implants",
    serviceName: "Dental Implants",
    preferredDate: isoInDays(4),
    preferredTime: "14:00",
    message: "Missing lower molar on the left side. Would like an estimate first.",
    status: "pending",
    createdAt: isoHoursAgo(20),
  },
  {
    id: "apt_1043",
    fullName: "Elise Laurent",
    phone: "+31 6 4412 7788",
    email: "elise.laurent@example.com",
    serviceId: "svc_whitening",
    serviceName: "Teeth Whitening",
    preferredDate: isoInDays(1),
    preferredTime: "11:00",
    message: "Wedding in three weeks — would love the brightest natural result.",
    status: "confirmed",
    createdAt: isoHoursAgo(12),
  },
  {
    id: "apt_1044",
    fullName: "Pieter Hendriks",
    phone: "+31 6 5510 3322",
    email: "p.hendriks@example.com",
    serviceId: "svc_emergency",
    serviceName: "Emergency Dental Care",
    preferredDate: isoInDays(0),
    preferredTime: "08:30",
    message: "Chipped front tooth last night, some sensitivity to cold.",
    status: "completed",
    createdAt: isoHoursAgo(9),
  },
  {
    id: "apt_1045",
    fullName: "Noor van Leeuwen",
    phone: "+31 6 6620 4471",
    email: "noor.vanleeuwen@example.com",
    serviceId: "svc_pediatric",
    serviceName: "Pediatric Dentistry",
    preferredDate: isoInDays(6),
    preferredTime: "15:30",
    message: "First visit for my daughter, she is five and a bit nervous.",
    status: "pending",
    createdAt: isoHoursAgo(6),
  },
  {
    id: "apt_1046",
    fullName: "Ahmed Rahimi",
    phone: "+31 6 7781 9002",
    email: "ahmed.rahimi@example.com",
    serviceId: "svc_orthodontics",
    serviceName: "Orthodontics",
    preferredDate: isoInDays(8),
    preferredTime: "17:00",
    message: "Interested in clear aligners for lower crowding.",
    status: "confirmed",
    createdAt: isoHoursAgo(3),
  },
  {
    id: "apt_1047",
    fullName: "Charlotte Visser",
    phone: "+31 6 8890 2213",
    email: "c.visser@example.com",
    serviceId: "svc_cosmetic",
    serviceName: "Cosmetic Dentistry",
    preferredDate: isoInDays(-3),
    preferredTime: "10:00",
    message: "Would like to discuss veneers for the two front teeth.",
    status: "cancelled",
    createdAt: isoHoursAgo(72),
  },
];

export const seedContent: SiteContent = {
  brand: {
    name: "DentaCare Clinic",
    tagline: "Modern dentistry in the heart of Amsterdam",
    established: "2011",
  },
  hero: {
    eyebrow: "Amsterdam · Since 2011",
    headline: "Your Smile.",
    highlight: "Our Expertise.",
    subheadline:
      "Six specialists, one calm clinic and a plan built around your teeth. From a routine clean to full implant reconstruction, we combine digital diagnostics with genuinely gentle care.",
    primaryCta: "Book an Appointment",
    secondaryCta: "Our Services",
    note: "No waiting lists · Evening and Saturday appointments · All major insurers accepted",
  },
  about: {
    lead:
      "DentaCare Clinic was founded on a simple observation: people do not fear dentistry, they fear being rushed, surprised by a bill or talked over. So we built a practice that does none of those things.",
    story: [
      "We opened our doors on the Keizersgracht in 2011 with two treatment rooms and a second-hand X-ray machine. Today DentaCare is a six-specialist clinic with in-house 3D imaging, a dedicated children's room and a digital laboratory that produces same-day crowns.",
      "What has not changed is how we work. Every new patient starts with a 45-minute diagnostic appointment: full imaging, a conversation about what actually bothers you, and a written plan with fixed prices before a single instrument is picked up.",
      "We treat whole families, which means our pediatric team and our implantologists sit in the same room twice a week to review complex cases. Prevention first, intervention only where it earns its place.",
    ],
    values: [
      {
        id: "val_1",
        title: "Unhurried by design",
        description: "Longer appointment slots and fewer patients per day. You will never be handed off mid-treatment.",
        icon: "clock",
      },
      {
        id: "val_2",
        title: "Prices agreed up front",
        description: "A written treatment plan with fixed prices and instalment options before we begin. No surprise invoices.",
        icon: "wallet",
      },
      {
        id: "val_3",
        title: "Technology that earns its keep",
        description: "3D CBCT, intraoral scanning and in-house milling — used because they mean fewer visits and better fits.",
        icon: "microscope",
      },
    ],
    milestones: [
      { id: "ms_1", year: "2011", title: "Two rooms on the Keizersgracht", description: "DentaCare opens with Dr. Vermeer and one dental nurse." },
      { id: "ms_2", year: "2015", title: "In-house 3D imaging", description: "One of the first Amsterdam practices with a CBCT scanner on site." },
      { id: "ms_3", year: "2019", title: "Children's wing", description: "A dedicated pediatric room with a ceiling projector opens." },
      { id: "ms_4", year: "2024", title: "Digital laboratory", description: "Same-day ceramic crowns milled and glazed in the building." },
    ],
    accreditations: [
      "KNMT registered practice",
      "ISO 13485 sterilisation protocol",
      "Invisalign Diamond Provider",
      "Recognised training practice (ACTA)",
    ],
  },
  stats: [
    { id: "st_1", value: "9,400+", label: "patients in long-term care" },
    { id: "st_2", value: "4.9/5", label: "from 1,240 reviews" },
    { id: "st_3", value: "15", label: "years on the Keizersgracht" },
    { id: "st_4", value: "24h", label: "emergency response time" },
  ],
  trust: [
    "KNMT registered",
    "ISO-certified sterilisation",
    "All major insurers accepted",
    "Same-day emergency slots",
  ],
  reasons: [
    {
      id: "why_1",
      title: "Digital-first diagnostics",
      description:
        "A 3D CBCT scan, intraoral camera and digital impressions in one appointment. You see exactly what we see, on screen, before any treatment is discussed.",
      icon: "scan",
    },
    {
      id: "why_2",
      title: "Pain-free, anxiety-friendly",
      description:
        "Numbing gel before every injection, sedation options for longer procedures and a stop-signal we always honour. Nervous patients are our speciality, not our exception.",
      icon: "heart",
    },
    {
      id: "why_3",
      title: "Transparent pricing",
      description:
        "Fixed prices per treatment, a written plan before you commit, direct billing with most Dutch insurers and interest-free instalments above €1,000.",
      icon: "wallet",
    },
    {
      id: "why_4",
      title: "One team for the family",
      description:
        "Pediatric care, hygiene, orthodontics, cosmetic work and implantology under one roof — with your records shared between the specialists who need them.",
      icon: "users",
    },
    {
      id: "why_5",
      title: "In the centre of Amsterdam",
      description:
        "Two minutes from tram 4 and metro 52, secure bike parking at the door, and evening or Saturday slots if a weekday does not work for you.",
      icon: "pin",
    },
    {
      id: "why_6",
      title: "Multilingual team",
      description:
        "Consultations in Dutch, English, German, French, Italian and Turkish, so nothing important gets lost in translation.",
      icon: "languages",
    },
  ],
  clinic: {
    name: "DentaCare Clinic",
    phone: "+31 20 123 4567",
    whatsapp: "+31 6 1234 5678",
    email: "hello@dentacare-clinic.com",
    street: "Keizersgracht 128",
    postalCode: "1015 CW",
    city: "Amsterdam",
    country: "Netherlands",
    mapsQuery: "Keizersgracht 128, 1015 CW Amsterdam",
    hours: [
      { id: "hr_1", day: "Monday", hours: "08:00 – 18:00" },
      { id: "hr_2", day: "Tuesday", hours: "08:00 – 18:00" },
      { id: "hr_3", day: "Wednesday", hours: "08:00 – 20:00" },
      { id: "hr_4", day: "Thursday", hours: "08:00 – 18:00" },
      { id: "hr_5", day: "Friday", hours: "08:00 – 17:00" },
      { id: "hr_6", day: "Saturday", hours: "10:00 – 14:00 (by appointment)" },
      { id: "hr_7", day: "Sunday", hours: "Closed" },
    ],
    socials: [
      { id: "so_1", label: "Instagram", href: "https://instagram.com" },
      { id: "so_2", label: "Facebook", href: "https://facebook.com" },
      { id: "so_3", label: "LinkedIn", href: "https://linkedin.com" },
    ],
    emergencyNote: "Dental emergency? Call us before 10:00 and we will almost always see you the same day.",
  },
  gallery: [
    {
      id: "gal_1",
      title: "Reception & waiting lounge",
      caption: "Calm, daylight-filled entrance with herbal tea and noise-cancelling headphones on request.",
      category: "Clinic",
      tone: "teal",
      motif: "clinic",
    },
    {
      id: "gal_2",
      title: "Treatment room one",
      caption: "Ceiling-mounted screen for films and treatment imaging, plus noise-cancelling headphones.",
      category: "Clinic",
      tone: "blue",
      motif: "treatment",
    },
    {
      id: "gal_3",
      title: "3D imaging suite",
      caption: "CBCT scanner and intraoral scanning station used for implant and orthodontic planning.",
      category: "Technology",
      tone: "ink",
      motif: "technology",
    },
    {
      id: "gal_4",
      title: "Children's room",
      caption: "Pediatric room with ceiling projector, wall-to-wall floor cushions and a no-drill check-up policy.",
      category: "Clinic",
      tone: "sand",
      motif: "kids",
    },
    {
      id: "gal_5",
      title: "Digital laboratory",
      caption: "In-house milling unit producing same-day ceramic crowns and veneers.",
      category: "Technology",
      tone: "mint",
      motif: "technology",
    },
    {
      id: "gal_6",
      title: "Whitening consultation",
      caption: "Shade calibration against skin tone before every whitening session.",
      category: "Treatments",
      tone: "sky",
      motif: "smile",
    },
    {
      id: "gal_7",
      title: "The clinical team",
      caption: "Six specialists working across implantology, orthodontics, cosmetics and pediatric care.",
      category: "Team",
      tone: "teal",
      motif: "team",
    },
    {
      id: "gal_8",
      title: "Implant surgery",
      caption: "Guided implant placement using a digitally printed surgical template.",
      category: "Treatments",
      tone: "ink",
      motif: "treatment",
    },
    {
      id: "gal_9",
      title: "Hygiene & prevention",
      caption: "Air polishing and ultrasonic scaling in our dedicated hygiene room.",
      category: "Treatments",
      tone: "blue",
      motif: "treatment",
    },
  ],
  beforeAfter: [
    {
      id: "ba_1",
      treatment: "Composite bonding, upper front four",
      duration: "1 visit · 90 minutes",
      summary: "Worn edges and a 1.5 mm gap closed with hand-layered composite. No enamel removal required.",
      tone: "teal",
    },
    {
      id: "ba_2",
      treatment: "Clear aligner therapy",
      duration: "11 months",
      summary: "Crowded lower arch and an anterior crossbite corrected with 24 aligner sets and night retainers.",
      tone: "blue",
    },
    {
      id: "ba_3",
      treatment: "Implant and ceramic crown",
      duration: "4 months end-to-end",
      summary: "Left first molar replaced with a guided implant, healed and restored with a milled zirconia crown.",
      tone: "mint",
    },
    {
      id: "ba_4",
      treatment: "Professional whitening",
      duration: "1 visit · 60 minutes",
      summary: "Seven shades lifted in a single session, finished with a two-week take-home maintenance kit.",
      tone: "sky",
    },
  ],
  faqs: [
    {
      id: "faq_1",
      question: "How do I book an appointment?",
      answer:
        "Request a slot through the booking form on this website, call us on +31 20 123 4567, or message us on WhatsApp. Our patient care team confirms every request within one working day, usually within a few hours.",
    },
    {
      id: "faq_2",
      question: "Do you accept dental insurance?",
      answer:
        "We work with all major Dutch insurers, including Achmea, CZ, Menzies, VGZ and DSW, and bill them directly for covered treatment. Bring your policy details to the first visit and we will check your available budget before we plan anything.",
    },
    {
      id: "faq_3",
      question: "I am nervous about the dentist — what can you do?",
      answer:
        "More than a third of our patients came to us because of dental anxiety. We offer longer appointment slots, numbing gel before every injection, nitrous oxide sedation, and a stop-signal we always respect immediately. You can also book a free 15-minute meet-and-greet with no treatment at all.",
    },
    {
      id: "faq_4",
      question: "How long does a dental implant take?",
      answer:
        "Placement itself takes about an hour. Healing before the final crown is usually 8 to 12 weeks, and we can fit a temporary tooth the same day so you are never left with a gap. Complex cases needing bone grafting add around three months.",
    },
    {
      id: "faq_5",
      question: "Can I get an emergency appointment today?",
      answer:
        "Yes. We keep two slots open every weekday for urgent cases and run a Saturday morning emergency line. Call before 10:00 and we will almost always see you the same day for pain relief or a temporary repair.",
    },
    {
      id: "faq_6",
      question: "From what age should my child see a dentist?",
      answer:
        "From the appearance of the first tooth, and definitely by their second birthday. First check-ups are free for children under six, and our pediatric room is designed so the visit feels like a game rather than an examination.",
    },
    {
      id: "faq_7",
      question: "How much does teeth whitening cost?",
      answer:
        "In-chair whitening starts at €349 and includes a shade assessment, the full session and a take-home maintenance kit. We always confirm the exact price in writing after your assessment, before the treatment begins.",
    },
    {
      id: "faq_8",
      question: "Where exactly are you, and is there parking?",
      answer:
        "We are at Keizersgracht 128, 1015 CW Amsterdam — two minutes from the Westermarkt tram stop and Metro 52. There is secure bike parking at the door and two paid garages within a five-minute walk.",
    },
  ],
  finalCta: {
    headline: "Ready to meet your new dental team?",
    description:
      "Book a first appointment and we will take the time to understand your teeth, your history and what you actually want. No pressure, no upselling, no surprise invoices.",
    note: "First consultations are 45 minutes and include full digital imaging.",
  },
  footerNote: "Demo website. All doctors, patients, reviews and contact details are fictional.",
};

export const seedDatabase: Database = {
  services: seedServices,
  doctors: seedDoctors,
  testimonials: seedTestimonials,
  appointments: seedAppointments,
  content: seedContent,
};
