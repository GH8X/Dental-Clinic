import { ArrowRight, Check, HeartHandshake, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PhotoFrame } from "@/components/ui/photo";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaSection } from "@/components/site/CtaSection";
import { DoctorMiniCard } from "@/components/site/DoctorCard";
import { PageHero } from "@/components/site/PageHero";
import { StatRow } from "@/components/site/TrustStrip";

export default function About() {
  const { content, publishedDoctors } = useData();

  return (
    <>
      <PageHero
        eyebrow="About the practice"
        title={
          <>
            A clinic built around calm, clarity and{" "}
            <span className="font-display italic text-brand-600">craft</span>.
          </>
        }
        description={content.about.lead}
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" variant="brand" size="lg">
            Book a first consultation
          </ButtonLink>
          <ButtonLink to="/doctors" variant="secondary" size="lg">
            Meet the team
            <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">
              <span className="h-px w-6 bg-brand-400/70" />
              Our story
            </p>
            <h2 className="text-balance">
              Two treatment rooms, one promise — and fifteen years of keeping it.
            </h2>
            <div className="prose-clinic mt-6 text-[15.5px]">
              {content.about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <PhotoFrame
              tone="teal"
              motif="clinic"
              aspect="video"
              label="Reception, Keizersgracht 128"
              className="shadow-card"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <PhotoFrame tone="blue" motif="technology" aspect="video" label="3D imaging" tag={false} />
              <PhotoFrame tone="sand" motif="kids" aspect="video" label="Children's room" tag={false} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section size="sm">
        <StatRow stats={content.stats} />
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="How we work"
          title="Three commitments we do not negotiate on"
          description="These are the rules we hire by, train by and measure ourselves against — not marketing lines."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {content.about.values.map((value, index) => (
            <Reveal key={value.id} delay={index * 0.06}>
              <article className="h-full rounded-4xl border border-ink-100/80 bg-white p-8 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon name={value.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 font-display text-[19px] text-ink-900">{value.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">{value.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 rounded-4xl border border-brand-100 bg-white p-8 sm:p-10">
          <Quote className="h-8 w-8 text-brand-200" strokeWidth={1.5} />
          <blockquote className="mt-5 max-w-3xl font-display text-xl leading-relaxed text-ink-800 sm:text-2xl">
            “We would rather explain a tooth for twenty minutes than replace it in ten. Prevention is not a sales
            strategy for us — it is the treatment with the best evidence behind it.”
          </blockquote>
          <p className="mt-5 text-[13.5px] text-ink-400">Dr. Anna Vermeer · Founder & Implantologist</p>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Milestones"
              title="Fifteen years, one address"
              description="How a two-room practice on the Keizersgracht grew into a six-specialist clinic."
            />
            <ul className="mt-9 space-y-3">
              {content.about.accreditations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14.5px] text-ink-600">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Reveal>
            <ol className="relative space-y-8 border-l border-dashed border-ink-200 pl-8">
              {content.about.milestones.map((milestone) => (
                <li key={milestone.id} className="relative">
                  <span className="absolute -left-[2.6rem] grid h-8 w-8 place-items-center rounded-full border border-brand-200 bg-white font-display text-[10.5px] text-brand-700 shadow-soft">
                    {milestone.year}
                  </span>
                  <h3 className="font-display text-lg text-ink-900">{milestone.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-500">{milestone.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="The team"
          title="Specialists you will meet by name"
          description="Four dentists and a lead hygienist, supported by eight nurses, coordinators and laboratory technicians."
          action={
            <ButtonLink to="/doctors" variant="secondary" size="md">
              Full team profiles
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
            </ButtonLink>
          }
        />

        <Reveal stagger={0.06} className="mt-12 grid gap-4 sm:grid-cols-2">
          {publishedDoctors.map((doctor) => (
            <RevealItem key={doctor.id}>
              <DoctorMiniCard doctor={doctor} />
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center gap-4 rounded-4xl border border-ink-100 bg-white p-7">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <HeartHandshake className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <p className="flex-1 text-[14.5px] leading-relaxed text-ink-500">
            Nervous about dentists? We run free 15-minute meet-and-greets with no treatment and no obligation.{" "}
            <Link to="/contact" className="font-medium text-brand-700 transition-colors hover:text-brand-800">
              Arrange a visit
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
