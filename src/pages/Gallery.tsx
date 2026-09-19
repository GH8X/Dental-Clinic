import { useMemo, useState } from "react";
import { CalendarCheck, Camera } from "lucide-react";
import { useData } from "@/lib/data-context";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { PhotoFrame } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { CtaSection } from "@/components/site/CtaSection";
import { PageHero } from "@/components/site/PageHero";

export default function Gallery() {
  const { content } = useData();
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(content.gallery.map((item) => item.category)))],
    [content.gallery],
  );

  const items = useMemo(
    () => (category === "All" ? content.gallery : content.gallery.filter((item) => item.category === category)),
    [category, content.gallery],
  );

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Inside the clinic, and what we do{" "}
            <span className="font-display italic text-brand-600">inside it</span>.
          </>
        }
        description="Treatment rooms, technology, the children's room and real before/after outcomes from our Amsterdam practice. All imagery below stands in for the practice photography shoot."
        crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink to="/appointment" variant="brand" size="lg">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
            Book a visit
          </ButtonLink>
          <span className="inline-flex items-center gap-2 text-[13.5px] text-ink-400">
            <Camera className="h-4 w-4" strokeWidth={1.8} />
            Replace these placeholders with your own photography
          </span>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Clinic & treatments"
          title="A calm space, built for nervous patients"
          description="Every room was designed with the same question in mind: would this make an anxious patient feel more at ease?"
        />

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-200",
                category === item
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-ink-200 bg-white text-ink-500 hover:border-brand-200 hover:text-brand-700",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 0.05}>
              <PhotoFrame
                tone={item.tone}
                motif={item.motif}
                label={item.title}
                caption={item.caption}
                aspect="video"
                className="transition-transform duration-500 hover:-translate-y-1"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Before & after"
          title="Outcomes, with the treatment that produced them"
          description="Drag each handle to compare. We publish the treatment name and realistic duration alongside every result — no retouched marketing claims."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {content.beforeAfter.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <BeforeAfterSlider item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 rounded-4xl border border-ink-100 bg-white p-7 text-[13.5px] leading-relaxed text-ink-500">
          Patient images are shared with written consent and are illustrative of typical results. Individual outcomes
          depend on enamel, gum health, bone density and aftercare — we explain what is realistic in your case before
          you decide.
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
