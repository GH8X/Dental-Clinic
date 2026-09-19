import { ArrowRight, CalendarCheck, Check, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function CtaSection() {
  const { content, approvedTestimonials } = useData();
  const clinic = content.clinic;
  const today = WEEKDAYS[new Date().getDay()];
  const rating = approvedTestimonials.length
    ? approvedTestimonials.reduce((total, item) => total + item.rating, 0) / approvedTestimonials.length
    : 5;

  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-6rem] h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute -right-24 bottom-[-8rem] h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-[0.06]" style={{ backgroundSize: "60px 60px" }} />
      </div>

      <div className="container relative py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5 text-brand-300">
              <span className="h-px w-6 bg-brand-300/70" />
              Book your visit
            </p>
            <h2 className="text-balance text-white">{content.finalCta.headline}</h2>
            <p className="mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-ink-100/75">
              {content.finalCta.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/appointment" variant="brand" size="lg">
                <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              </ButtonLink>
              <ButtonAnchor
                href={generalWhatsappLink(clinic.whatsapp)}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="lg"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                WhatsApp us
              </ButtonAnchor>
              <ButtonAnchor
                href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                size="lg"
                variant="secondary"
                className="border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white"
              >
                <Phone className="h-4 w-4" strokeWidth={1.9} />
                {clinic.phone}
              </ButtonAnchor>
            </div>

            <ul className="mt-8 grid gap-3 text-[13.5px] text-ink-100/70 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-300" strokeWidth={2} />
                {content.finalCta.note}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-300" strokeWidth={2} />
                {rating.toFixed(1)}/5 average from 1,240 patient reviews
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-4xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl text-white">Opening hours</h3>
                  <p className="mt-1 text-[13px] text-ink-100/60">Today we are open until 18:00</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/20 text-brand-200">
                  <Clock className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>

              <dl className="mt-6 space-y-1.5 text-[13.5px]">
                {clinic.hours.map((entry) => {
                  const isToday = entry.day === today;
                  return (
                    <div
                      key={entry.id}
                      className={
                        isToday
                          ? "flex items-center justify-between rounded-2xl bg-brand-500/15 px-3.5 py-2 text-white"
                          : "flex items-center justify-between px-3.5 py-2 text-ink-100/65"
                      }
                    >
                      <dt>{entry.day}</dt>
                      <dd className={isToday ? "font-medium" : undefined}>{entry.hours}</dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-[13.5px] text-ink-100/75">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                  <span>
                    {clinic.street}, {clinic.postalCode} {clinic.city}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.8} />
                  <span>{clinic.emergencyNote}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
