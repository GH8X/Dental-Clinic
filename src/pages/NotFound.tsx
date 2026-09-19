import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { NAV_LINKS } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { ToothGlyph } from "@/components/layout/brand";

export default function NotFound() {
  const { content } = useData();

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      </div>

      <div className="container relative py-24 text-center sm:py-32">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow">
          <ToothGlyph className="h-8 w-8" />
        </span>
        <p className="eyebrow mt-8 justify-center">Error 404</p>
        <h1 className="mt-4 font-display text-4xl text-ink-900 sm:text-5xl">This page has been extracted.</h1>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-500">
          The link you followed does not exist at {content.brand.name}. Try one of the pages below, or book an
          appointment and we will point you in the right direction.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" variant="primary" size="lg">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
            Back to home
          </ButtonLink>
          <ButtonLink to="/appointment" variant="brand" size="lg">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
            Book an appointment
          </ButtonLink>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[14px] text-ink-500">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="transition-colors hover:text-brand-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
