import { ArrowRight, BadgeEuro, CalendarCheck, Check, MessageCircle, Sparkles } from "lucide-react";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { PhotoFrame } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaSection } from "@/components/site/CtaSection";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";

const PROCESS = [
  {
    step: "01",
    title: "Diagnosis & imaging",
    description:
      "A 45-minute first visit with digital X-rays, intraoral scans and a full health history — no treatment on the day.",
  },
  {
    step: "02",
    title: "Written plan & quote",
    description:
      "We explain every option, including doing nothing, and give you a fixed-price plan with insurance cover shown.",
  },
  {
    step: "03",
    title: "Treatment at your pace",
    description:
      "Split across appointments that fit your calendar, with pain management and sedation available on request.",
  },
  {
    step: "04",
    title: "Aftercare & reminders",
    description:
      "Written aftercare instructions, a direct line to your clinician and automated hygiene recalls every six months.",
  },
];

export default function Services() {
  const { content, publishedServices, featuredServices } = useData();
  const clinic = content.clinic;

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title={
          <>
            Dental care for every stage of{" "}
            <span className="font-display italic text-brand-600">life</span>.
          </>
        }
        description="Eight treatment areas, one clinical standard. Whether you need a six-month clean or a full-arch reconstruction, you will be treated by the specialist who planned your case."
        crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" variant="brand" size="lg">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
            Book a consultation
          </ButtonLink>
          <ButtonAnchor
            href={generalWhatsappLink(clinic.whatsapp)}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="lg"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
            Ask about a treatment
          </ButtonAnchor>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Most requested"
          title="Where patients usually start"
          description="These four treatments account for roughly two-thirds of everything we do — and each one begins with the same diagnostic appointment."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.05} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Full treatment list"
          title="Everything we offer"
          description="Prices shown are starting points for the listed treatment. You always receive a fixed quote in writing before we begin."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.04} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <PhotoFrame tone="blue" motif="treatment" aspect="video" label="Treatment room one" className="shadow-card" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <PhotoFrame tone="mint" motif="technology" aspect="video" label="Digital lab" tag={false} />
              <PhotoFrame tone="teal" motif="smile" aspect="video" label="Whitening studio" tag={false} />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="How treatment works"
              title="Four steps from first visit to finished result"
              description="No surprises, no pressure and no treatment started before you have agreed the plan and the price."
            />
            <ol className="mt-9 space-y-6">
              {PROCESS.map((item) => (
                <li key={item.step} className="flex gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-brand-100 bg-brand-50 font-display text-[13px] text-brand-700">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-ink-900">{item.title}</h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2 rounded-4xl border border-ink-100 bg-white p-8 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 ring-1 ring-inset ring-brand-100">
              <BadgeEuro className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h3 className="mt-5 font-display text-2xl text-ink-900">Transparent pricing, agreed in writing</h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
              Every plan lists the treatment codes your insurer uses, what they cover and what you pay. Above €1,000 we
              offer interest-free instalments over six months, and we bill most Dutch insurers directly so you are not
              waiting for reimbursements.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Fixed prices per treatment code",
                "Direct billing with major insurers",
                "Interest-free instalments above €1,000",
                "Second-opinion reviews at no cost",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-ink-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="rounded-4xl border border-brand-100 bg-white p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h3 className="mt-5 font-display text-xl text-ink-900">Not sure what you need?</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
              Send us a photo on WhatsApp or book a diagnostic appointment. We will tell you honestly what is urgent,
              what can wait and what is not necessary at all.
            </p>
            <div className="mt-6 space-y-3">
              <ButtonLink to="/appointment" variant="brand" size="md" className="w-full">
                Book a diagnostic visit
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
                Send a photo on WhatsApp
              </ButtonAnchor>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Good to know"
            title="Common questions about treatment"
            description="Can't find your answer? Our patient care team replies to WhatsApp messages within working hours."
            action={
              <ButtonLink to="/contact" variant="secondary" size="md">
                Contact the clinic
                <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              </ButtonLink>
            }
          />
          <Reveal>
            <Accordion items={content.faqs.slice(1, 6)} />
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
