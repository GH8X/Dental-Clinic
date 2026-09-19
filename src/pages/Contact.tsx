import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { ButtonAnchor, ButtonLink, Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaSection } from "@/components/site/CtaSection";
import { PageHero } from "@/components/site/PageHero";

const TOPICS = ["General enquiry", "New patient registration", "Insurance & costs", "Feedback", "Careers"];

interface EnquiryState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const EMPTY: EnquiryState = { name: "", email: "", phone: "", topic: TOPICS[0], message: "" };

export default function Contact() {
  const { content } = useData();
  const clinic = content.clinic;
  const [form, setForm] = useState<EnquiryState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof EnquiryState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof EnquiryState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Please tell us your name.";
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.phone && !isValidPhone(form.phone)) nextErrors.phone = "Enter a valid phone number or leave it blank.";
    if (form.message.trim().length < 10) nextErrors.message = "A little more detail helps us reply properly.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSubmitting(false);
    setSent(true);
  };

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapsQuery)}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to a real person at the{" "}
            <span className="font-display italic text-brand-600">clinic</span>.
          </>
        }
        description={`Call, message or email us — or find us on the Keizersgracht, two minutes from the Westermarkt tram stop. ${clinic.emergencyNote}`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor
            href={generalWhatsappLink(clinic.whatsapp)}
            target="_blank"
            rel="noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
            WhatsApp the clinic
          </ButtonAnchor>
          <ButtonAnchor href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`} variant="secondary" size="lg">
            <Phone className="h-4 w-4" strokeWidth={1.9} />
            {clinic.phone}
          </ButtonAnchor>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <Phone className="h-5 w-5" strokeWidth={1.7} />,
                  label: "Call the practice",
                  value: clinic.phone,
                  href: `tel:${clinic.phone.replace(/[^+\d]/g, "")}`,
                  note: "Mon–Fri 08:00–18:00",
                },
                {
                  icon: <MessageCircle className="h-5 w-5" strokeWidth={1.7} />,
                  label: "WhatsApp",
                  value: clinic.whatsapp,
                  href: generalWhatsappLink(clinic.whatsapp),
                  note: "Fastest replies, photos welcome",
                },
                {
                  icon: <Mail className="h-5 w-5" strokeWidth={1.7} />,
                  label: "Email",
                  value: clinic.email,
                  href: `mailto:${clinic.email}`,
                  note: "Answered within one working day",
                },
                {
                  icon: <MapPin className="h-5 w-5" strokeWidth={1.7} />,
                  label: "Visit us",
                  value: clinic.street,
                  href: mapsHref,
                  note: `${clinic.postalCode} ${clinic.city}`,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group rounded-4xl border border-ink-100/80 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                      {item.icon}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-500" />
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">{item.label}</p>
                  <p className="mt-1.5 font-display text-[16px] text-ink-900">{item.value}</p>
                  <p className="mt-1 text-[12.5px] text-ink-400">{item.note}</p>
                </a>
              ))}
            </div>

            <Reveal className="rounded-4xl border border-ink-100 bg-mist p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg text-ink-900">Opening hours</h3>
                <Clock className="h-5 w-5 text-brand-500" strokeWidth={1.7} />
              </div>
              <dl className="mt-5 space-y-2 text-[14px]">
                {clinic.hours.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between border-b border-white/70 pb-2 last:border-0">
                    <dt className="text-ink-400">{entry.day}</dt>
                    <dd className="text-ink-700">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="relative overflow-hidden rounded-4xl border border-ink-100">
              <div className="relative h-56 bg-gradient-to-br from-brand-50 via-white to-accent-50 sm:h-64">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #0B252B 1px, transparent 1px), linear-gradient(to bottom, #0B252B 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                />
                <div aria-hidden className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/40 blur-2xl" />
                <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
                    <MapPin className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <p className="font-display text-lg text-ink-900">{clinic.name}</p>
                  <p className="text-[13.5px] text-ink-500">
                    {clinic.street}, {clinic.postalCode} {clinic.city}
                  </p>
                  <ButtonAnchor href={mapsHref} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                    Open in Google Maps
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </ButtonAnchor>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-4xl border border-ink-100 bg-white p-7 shadow-card sm:p-9">
              {sent ? (
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-brand-50 text-brand-600">
                    <CheckCircle2 className="h-7 w-7" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-ink-900">Thank you, {form.name.split(" ")[0]}.</h3>
                  <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-500">
                    Your message about “{form.topic.toLowerCase()}” has been received. Our patient care team replies
                    within one working day — sooner if you message us on WhatsApp.
                  </p>
                  <div className="mt-7 space-y-3">
                    <ButtonAnchor
                      href={generalWhatsappLink(clinic.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      variant="whatsapp"
                      size="md"
                      className="w-full"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                      Continue on WhatsApp
                    </ButtonAnchor>
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={() => {
                        setForm(EMPTY);
                        setSent(false);
                      }}
                    >
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl text-ink-900">Send us a message</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
                    For appointments you can also use the{" "}
                    <ButtonLink to="/appointment" variant="ghost" size="sm" className="h-auto px-1 py-0 text-brand-700 underline">
                      booking form
                    </ButtonLink>{" "}
                    for a faster confirmation.
                  </p>

                  <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                    <Field label="Full name" htmlFor="contact-name" required error={errors.name}>
                      <Input
                        id="contact-name"
                        name="name"
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Marieke Jansen"
                        autoComplete="name"
                      />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Email" htmlFor="contact-email" required error={errors.email}>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={(event) => update("email", event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field label="Phone" htmlFor="contact-phone" error={errors.phone} hint="Optional">
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(event) => update("phone", event.target.value)}
                          placeholder="+31 6 1234 5678"
                          autoComplete="tel"
                        />
                      </Field>
                    </div>

                    <Field label="What is it about?" htmlFor="contact-topic">
                      <Select
                        id="contact-topic"
                        name="topic"
                        value={form.topic}
                        onChange={(event) => update("topic", event.target.value)}
                      >
                        {TOPICS.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label="Message" htmlFor="contact-message" required error={errors.message}>
                      <Textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={(event) => update("message", event.target.value)}
                        placeholder="Tell us briefly what you need and the best time to reach you."
                      />
                    </Field>

                    <Button type="submit" variant="brand" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" strokeWidth={1.9} />
                          Send message
                        </>
                      )}
                    </Button>

                    <p className="text-center text-[12px] leading-relaxed text-ink-400">
                      Demo website: submissions are validated and confirmed locally. Connect the form to your practice
                      inbox or database to receive messages.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Before you call"
            title="Answers to the questions we hear most"
            description="Registration, insurance, anxiety and emergencies — covered below."
            action={
              <ButtonLink to="/appointment" variant="brand" size="md">
                <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                Book instead
              </ButtonLink>
            }
          />
          <Reveal>
            <Accordion items={content.faqs.slice(0, 5)} />
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
