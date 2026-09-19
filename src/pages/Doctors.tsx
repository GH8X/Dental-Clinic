import { CalendarCheck, GraduationCap, Languages, MessageCircle, Timer } from "lucide-react";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { initials } from "@/lib/utils";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaSection } from "@/components/site/CtaSection";
import { DoctorCard } from "@/components/site/DoctorCard";
import { PageHero } from "@/components/site/PageHero";

const SUPPORT_TEAM = [
  { name: "Nina Bakker", role: "Practice Manager" },
  { name: "Ruben Smit", role: "Treatment Coordinator" },
  { name: "Aisha Diallo", role: "Dental Nurse · Surgery" },
  { name: "Mei Lin Tan", role: "Dental Nurse · Pediatrics" },
  { name: "Oscar Verhoeven", role: "Dental Technician" },
  { name: "Hannah de Wit", role: "Patient Care & Insurance" },
];

export default function Doctors() {
  const { content, publishedDoctors } = useData();
  const clinic = content.clinic;

  const combinedLanguages = Array.from(new Set(publishedDoctors.flatMap((doctor) => doctor.languages)));
  const combinedExperience = publishedDoctors.reduce((total, doctor) => total + doctor.experienceYears, 0);

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={
          <>
            The specialists who will plan, treat and{" "}
            <span className="font-display italic text-brand-600">follow up</span>.
          </>
        }
        description={`${publishedDoctors.length} clinicians with ${combinedExperience} combined years of experience, supported by nurses, coordinators and an in-house laboratory. You meet the same faces at every visit.`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Doctors" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" variant="brand" size="lg">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
            Book with a specialist
          </ButtonLink>
          <ButtonAnchor
            href={generalWhatsappLink(clinic.whatsapp)}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="lg"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
            Ask who is right for me
          </ButtonAnchor>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Clinicians"
          title="Meet the dentists and hygienists"
          description="Each profile lists the treatments they lead, their postgraduate training and the languages they consult in."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedDoctors.map((doctor, index) => (
            <Reveal key={doctor.id} delay={index * 0.05} className="h-full">
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist" size="sm">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: <Languages className="h-5 w-5" strokeWidth={1.7} />,
              title: "Consultations in six languages",
              description: combinedLanguages.join(", ") + ".",
            },
            {
              icon: <GraduationCap className="h-5 w-5" strokeWidth={1.7} />,
              title: "A recognised training practice",
              description: "We mentor postgraduate dentists and hygienists through ACTA Amsterdam and Invisalign training.",
            },
            {
              icon: <Timer className="h-5 w-5" strokeWidth={1.7} />,
              title: "Evening and Saturday clinics",
              description: "Wednesday until 20:00 and Saturday mornings, because work hours should not block your care.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="h-full rounded-4xl border border-ink-100/80 bg-white p-7 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  {item.icon}
                </span>
                <h3 className="mt-5 font-display text-lg text-ink-900">{item.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Behind the surgeries"
          title="The team that keeps everything running"
          description="From your first phone call to the laboratory work behind your crown, these are the people you will also get to know."
        />

        <Reveal stagger={0.05} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT_TEAM.map((member) => (
            <RevealItem key={member.name}>
              <div className="flex items-center gap-4 rounded-4xl border border-ink-100/80 bg-white p-5 shadow-soft transition-colors hover:border-brand-200">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 font-display text-[14px] text-brand-700">
                  {initials(member.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[15.5px] text-ink-900">{member.name}</span>
                  <span className="block truncate text-[13px] text-ink-400">{member.role}</span>
                </span>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
