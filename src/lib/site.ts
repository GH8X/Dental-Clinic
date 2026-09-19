import { whatsappLink } from "./utils";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Doctors", to: "/doctors" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
] as const;

export const ADMIN_NAV = [
  { label: "Overview", to: "/admin", icon: "dashboard" },
  { label: "Appointments", to: "/admin/appointments", icon: "calendar" },
  { label: "Services", to: "/admin/services", icon: "services" },
  { label: "Doctors", to: "/admin/doctors", icon: "doctors" },
  { label: "Testimonials", to: "/admin/testimonials", icon: "quotes" },
  { label: "Website content", to: "/admin/content", icon: "content" },
] as const;

/** Bookable slots, kept in one place so the form and the dashboard agree. */
export const TIME_SLOTS = Array.from({ length: 20 }, (_, index) => {
  const minutes = 8 * 60 + index * 30;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
});

export const DEMO_ADMIN_CREDENTIALS = {
  email: "admin@dentacare-clinic.com",
  password: "dentacare",
};

export function bookingWhatsappLink(clinicWhatsapp: string, name: string, serviceName: string, date: string, time: string) {
  const message = [
    `Hi DentaCare Clinic, I would like to book an appointment.`,
    `Name: ${name}`,
    `Treatment: ${serviceName}`,
    `Preferred: ${date} at ${time}`,
  ].join("\n");
  return whatsappLink(clinicWhatsapp, message);
}

export function generalWhatsappLink(clinicWhatsapp: string) {
  return whatsappLink(
    clinicWhatsapp,
    "Hi DentaCare Clinic, I have a question about your treatments and would like some advice.",
  );
}
