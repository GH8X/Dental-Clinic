import { ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { euro } from "@/lib/utils";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PhotoFrame } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaSection } from "@/components/site/CtaSection";
import { DoctorMiniCard } from "@/components/site/DoctorCard";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { NotFoundBody } from "@/components/site/NotFoundBody";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { content, serviceBySlug, publishedServices, publishedDoctors } = useData();
  const clinic = content.clinic;
  const service = slug ? serviceBySlug(slug) : undefined;

  if (!service) {
    return (
      <NotFoundBody
        title="Treatment not found"
        description="We could not find that treatment. Browse our full treatment list instead — or ask us directly and we will point you to the right specialist."
      />
    );
  }

  const related = publishedServices.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.duration}
        title={service.name}
        description={service.tagline}
        crumbs={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: service.name }]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink to={`/appointment?service=${service.slug}`} variant="brand" size="lg">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
            Book this treatment
          </ButtonLink>
          <span className="text-[14px] text-ink-500">
            from <span className="font-display text-xl text-ink-900">{euro(service.priceFrom)}</span>
          </span>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-7 text-balance">Treatment overview</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-500">{service.description}</p>
            </Reveal>

            <Reveal delay={0.06} className="mt-10">
              <h3 className="font-display text-xl text-ink-900">What is included</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-3xl border border-ink-100 bg-white p-4 text-[14px] text-ink-600 shadow-soft"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.2} />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="mt-10">
              <h3 className="font-display text-xl text-ink-900">How an appointment runs</h3>
              <ol className="mt-5 space-y-5 border-l border-dashed border-ink-200 pl-7">
                {[
                  "Assessment and imaging of the treatment area, with photos shown on screen.",
                  "A clear explanation of the options, including the risks of waiting.",
                  "Your written plan with fixed prices and expected number of visits.",
                  "Treatment scheduled at a pace that suits you, with aftercare in writing.",
                ].map((step, index) => (
                  <li key={step} className="relative text-[14.5px] leading-relaxed text-ink-500">
                    <span className="absolute -left-[2.35rem] grid h-7 w-7 place-items-center rounded-full border border-brand-200 bg-white font-display text-[11px] text-brand-700">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.18} className="mt-10 grid gap-4 sm:grid-cols-2">
              <PhotoFrame tone="teal" motif="treatment" aspect="video" label="In treatment" tag={false} />
              <PhotoFrame tone="blue" motif="technology" aspect="video" label="Digital diagnostics" tag={false} />
            </Reveal>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-4xl border border-ink-100 bg-white p-7 shadow-soft">
              <p className="eyebrow">At a glance</p>
              <dl className="mt-5 space-y-4 text-[14px]">
                <div className="flex items-center justify-between border-b border-ink-100 pb-3">
                  <dt className="text-ink-400">Price from</dt>
                  <dd className="font-display text-lg text-ink-900">{euro(service.priceFrom)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-ink-100 pb-3">
                  <dt className="text-ink-400">Duration</dt>
                  <dd className="text-ink-700">{service.duration}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-400">Booking lead time</dt>
                  <dd className="text-ink-700">2–5 working days</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-3">
                <ButtonLink to={`/appointment?service=${service.slug}`} variant="brand" size="md" className="w-full">
                  <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                  Request an appointment
                </ButtonLink>
                <ButtonAnchor
                  href={generalWhatsappLink(clinic.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlineBrand"
                  size="md"
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                  Ask a question on WhatsApp
                </ButtonAnchor>
              </div>

              <p className="mt-5 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
                Covered by most Dutch insurers. We check your policy before treatment starts.
              </p>
            </div>

            <div className="rounded-4xl border border-ink-100 bg-mist p-7">
              <p className="eyebrow">
                <span className="h-px w-6 bg-brand-400/70" />
                Practice
              </p>
              <p className="mt-4 flex items-center gap-2 text-[14px] text-ink-600">
                <Phone className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                <a href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-brand-700">
                  {clinic.phone}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-2 text-[14px] text-ink-600">
                <Clock className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                Mon–Fri from 08:00, Sat by appointment
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-400">
                {clinic.street}, {clinic.postalCode} {clinic.city}
              </p>
            </div>

            <div className="rounded-4xl border border-ink-100 bg-white p-7 shadow-soft">
              <p className="eyebrow mb-4">Specialists for this treatment</p>
              <div className="space-y-3">
                {publishedDoctors.slice(0, 3).map((doctor) => (
                  <DoctorMiniCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Related treatments"
          title="Patients often combine these"
          action={
            <ButtonLink to="/services" variant="secondary" size="md">
              All treatments
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </ButtonLink>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05} className="h-full">
              <ServiceCard service={item} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-[14px] font-medium text-brand-700">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
            Back to all treatments
          </Link>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
