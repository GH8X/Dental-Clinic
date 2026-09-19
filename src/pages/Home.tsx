import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { formatDate, initials } from "@/lib/utils";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import { PhotoFrame } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { Stars } from "@/components/ui/stars";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { CtaSection } from "@/components/site/CtaSection";
import { DoctorCard } from "@/components/site/DoctorCard";
import { ServiceCard } from "@/components/site/ServiceCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { StatRow, TrustStrip } from "@/components/site/TrustStrip";

export default function Home() {
  const { content, featuredServices, publishedServices, publishedDoctors, approvedTestimonials } = useData();
  const clinic = content.clinic;

  const averageRating = approvedTestimonials.length
    ? approvedTestimonials.reduce((total, item) => total + item.rating, 0) / approvedTestimonials.length
    : 5;

  const nextSlot = new Date();
  nextSlot.setDate(nextSlot.getDate() + 1);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -left-32 top-40 h-[26rem] w-[26rem] rounded-full bg-accent-100/60 blur-3xl" />
          <div
            className="absolute inset-x-0 top-0 h-[36rem] bg-grid-soft opacity-[0.5]"
            style={{ backgroundSize: "64px 64px" }}
          />
          <div className="absolute inset-x-0 top-0 h-[36rem] bg-gradient-to-b from-white/0 via-white/60 to-white" />
        </div>

        <div className="container relative pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3.5 py-1.5 text-[12.5px] font-medium text-brand-700 shadow-soft backdrop-blur">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                  </span>
                  {content.hero.eyebrow}
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-7 text-balance">
                  {content.hero.headline}{" "}
                  <span className="relative whitespace-nowrap font-display italic text-brand-600">
                    {content.hero.highlight}
                    <svg
                      aria-hidden
                      viewBox="0 0 300 12"
                      preserveAspectRatio="none"
                      className="absolute -bottom-1 left-0 h-2.5 w-full text-brand-300/70"
                    >
                      <path d="M2 9C60 3 150 2 298 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-7 max-w-xl text-pretty text-[16.5px] leading-relaxed text-ink-500">
                  {content.hero.subheadline}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ButtonLink to="/appointment" variant="brand" size="lg">
                    <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                    {content.hero.primaryCta}
                  </ButtonLink>
                  <ButtonLink to="/services" variant="secondary" size="lg">
                    {content.hero.secondaryCta}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-400">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                    {content.hero.note}
                  </span>
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-ink-100 pt-7">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      {publishedDoctors.slice(0, 4).map((doctor) => (
                        <span
                          key={doctor.id}
                          className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-brand-100 to-accent-100 font-display text-[11px] text-brand-700 shadow-soft"
                          title={doctor.name}
                        >
                          {initials(doctor.name)}
                        </span>
                      ))}
                    </div>
                    <div className="text-[13px] leading-tight">
                      <p className="font-medium text-ink-800">{publishedDoctors.length} specialists</p>
                      <p className="text-ink-400">on staff in Amsterdam</p>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-ink-100" />

                  <div className="text-[13px] leading-tight">
                    <span className="flex items-center gap-1.5">
                      <Stars rating={averageRating} />
                      <span className="font-medium text-ink-800">{averageRating.toFixed(1)}</span>
                    </span>
                    <p className="mt-1 text-ink-400">1,240 verified patient reviews</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Hero visual */}
            <Reveal delay={0.15} className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <PhotoFrame
                  tone="teal"
                  motif="smile"
                  aspect="tall"
                  label="Smile design studio"
                  caption="Digital smile preview · Keizersgracht 128, Amsterdam"
                  className="shadow-card"
                />

                <div className="absolute -left-4 bottom-14 w-[15.5rem] rounded-3xl border border-ink-100 bg-white/95 p-4 shadow-lift backdrop-blur sm:-left-8">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                      <Clock className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Next opening</p>
                      <p className="truncate font-display text-[15px] text-ink-900">
                        {formatDate(nextSlot.toISOString(), { weekday: "long", day: "numeric", month: "short" })} · 09:30
                      </p>
                    </div>
                  </div>
                  <ButtonLink to="/appointment" variant="soft" size="sm" className="mt-3 w-full">
                    Reserve this slot
                  </ButtonLink>
                </div>

                <div className="absolute -right-4 top-10 hidden w-[13rem] rounded-3xl border border-ink-100 bg-white/95 p-4 shadow-lift backdrop-blur lg:block">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-800">
                    <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                    Same-day crowns
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-400">
                    Milled and glazed in our own laboratory.
                  </p>
                </div>

                <div className="absolute -bottom-6 right-2 hidden items-center gap-3 rounded-3xl border border-ink-100 bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:flex">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                  </span>
                  <p className="text-[12.5px] text-ink-600">
                    <span className="font-medium text-ink-900">KNMT</span> registered practice
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Trust */}
      <div className="border-y border-ink-100 bg-mist py-7">
        <div className="container">
          <TrustStrip
            items={[...content.trust, ...content.about.accreditations.slice(0, 2)]}
            className="justify-center gap-x-8"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------ Reasons */}
      <Section size="md">
        <SectionHeading
          eyebrow="Why patients choose DentaCare"
          title={
            <>
              Serious dentistry, delivered like{" "}
              <span className="font-display italic text-brand-600">hospitality</span>.
            </>
          }
          description="We combine the diagnostics of a hospital clinic with the calm of a boutique practice. Here is what that actually means for your visit."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.reasons.map((reason, index) => (
            <Reveal key={reason.id} delay={index * 0.04}>
              <article className="group h-full rounded-4xl border border-ink-100/80 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon name={reason.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 font-display text-[19px] text-ink-900">{reason.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">{reason.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-10 rounded-4xl border border-ink-100 bg-mist p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-12">
          <PhotoFrame tone="blue" motif="technology" label="3D imaging suite" aspect="video" />
          <div>
            <p className="eyebrow mb-4">
              <span className="h-px w-6 bg-brand-400/70" />
              Our approach
            </p>
            <h3 className="text-balance font-display text-2xl leading-snug text-ink-900 sm:text-[1.85rem]">
              Every treatment starts with a plan you can see, question and afford.
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-500">
              Your first visit is 45 minutes of diagnostics, not a sales pitch: full imaging, a conversation about what
              bothers you, and a written proposal with fixed prices. You leave knowing exactly what is happening next,
              why, and what it costs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink to="/about" variant="primary" size="md">
                How we work
                <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              </ButtonLink>
              <ButtonAnchor
                href={generalWhatsappLink(clinic.whatsapp)}
                target="_blank"
                rel="noreferrer"
                variant="outlineBrand"
                size="md"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                Ask a question
              </ButtonAnchor>
            </div>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- Services */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="Treatments"
          title="Complete care under one roof"
          description="From a six-month clean to full-arch reconstruction, our six specialists cover every stage of dental health — with your records shared between the people who need them."
          action={
            <ButtonLink to="/services" variant="secondary" size="md">
              All {publishedServices.length} treatments
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </ButtonLink>
          }
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.05} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13.5px] text-ink-500">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
            All major insurers billed directly
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
            Evening and Saturday appointments
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
            Same-day emergency slots before 10:00
          </span>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------- Stats */}
      <Section size="sm">
        <StatRow stats={content.stats} />
      </Section>

      {/* ------------------------------------------------------------ Doctors */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="Meet the team"
          title="The people who will actually treat you"
          description="No rotating locums and no handovers mid-treatment. You meet the specialist who plans your case and stays with it until it is finished."
          action={
            <ButtonLink to="/doctors" variant="secondary" size="md">
              Meet the full team
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </ButtonLink>
          }
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedDoctors.slice(0, 3).map((doctor, index) => (
            <Reveal key={doctor.id} delay={index * 0.06} className="h-full">
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Before/After */}
      <Section>
        <SectionHeading
          eyebrow="Real treatment outcomes"
          title="Before and after"
          description="Drag the handle to compare. Every result below was completed in our Amsterdam clinic using the treatment plan described alongside it."
          action={
            <ButtonLink to="/gallery" variant="secondary" size="md">
              Browse the gallery
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </ButtonLink>
          }
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {content.beforeAfter.slice(0, 2).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <BeforeAfterSlider item={item} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- Testimonials */}
      <Section tone="mist">
        <SectionHeading
          align="center"
          eyebrow="Patient stories"
          title="Rated 4.9 out of 5 by our patients"
          description="Unedited reviews from people who found us through their insurer, their partner or the internet — and stayed."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {approvedTestimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.06} className="h-full">
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[13.5px] text-ink-500">
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
            1,240 reviews across Google, Zorgkaart and Trustpilot
          </span>
          <Link to="/contact" className="font-medium text-brand-700 transition-colors hover:text-brand-800">
            Share your experience →
          </Link>
        </Reveal>
      </Section>

      {/* ----------------------------------------------------------------- FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Good to know"
              title="Questions patients ask before booking"
              description="Still unsure about something? Send us a WhatsApp message — our patient care team answers within working hours."
            />
            <div className="mt-9 rounded-4xl border border-ink-100 bg-mist p-7">
              <h3 className="font-display text-lg text-ink-900">Prefer to talk it through?</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
                Call the practice on {clinic.phone} or message us on WhatsApp and we will help you choose the right
                appointment type.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonAnchor
                  href={generalWhatsappLink(clinic.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="md"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                  WhatsApp
                </ButtonAnchor>
                <ButtonAnchor
                  href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                  variant="secondary"
                  size="md"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.9} />
                  Call the clinic
                </ButtonAnchor>
              </div>
            </div>
          </div>

          <Reveal>
            <Accordion items={content.faqs} />
          </Reveal>
        </div>
      </Section>

      <CtaSection />

      {/* --------------------------------------------------- Services teaser */}
      <Section size="sm" tone="mist">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {publishedServices.slice(4, 8).map((service, index) => (
            <Reveal key={service.id} delay={index * 0.05} className="h-full">
              <ServiceCard service={service} compact />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
