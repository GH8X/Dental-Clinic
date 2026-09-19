import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink, NAV_LINKS } from "@/lib/site";
import { BrandMark } from "./brand";

export function Footer() {
  const { content, publishedServices } = useData();
  const clinic = content.clinic;

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-ink-100/75">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl"
      />

      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <BrandMark variant="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">{content.brand.tagline}. {content.footerNote}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.about.accreditations.slice(0, 2).map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-ink-100/70">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/appointment" className="transition-colors hover:text-white">
                  Book an appointment
                </Link>
              </li>
              <li>
                <Link to="/admin" className="inline-flex items-center gap-1 transition-colors hover:text-white">
                  Client dashboard
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white">Treatments</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {publishedServices.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${service.slug}`} className="transition-colors hover:text-white">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white">Visit us</h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.7} />
                <span>
                  {clinic.street}
                  <br />
                  {clinic.postalCode} {clinic.city}, {clinic.country}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.7} />
                <a href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-white">
                  {clinic.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.7} />
                <a href={`mailto:${clinic.email}`} className="transition-colors hover:text-white">
                  {clinic.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.7} />
                <a
                  href={generalWhatsappLink(clinic.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp {clinic.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            {clinic.hours.map((entry) => (
              <span key={entry.id} className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.7} />
                <span className="text-ink-100/60">{entry.day}</span>
                <span className="text-ink-100/85">{entry.hours}</span>
              </span>
            ))}
          </div>
          <div className="flex justify-start gap-3 lg:justify-end">
            {clinic.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12.5px] text-ink-100/75 transition-colors hover:border-brand-400/40 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-[12.5px] text-ink-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {content.brand.name}. Established {content.brand.established}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-5">
            <span>Privacy statement</span>
            <span>Patient terms</span>
            <span>Complaints procedure</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
