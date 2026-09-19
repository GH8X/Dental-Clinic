import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { bookingWhatsappLink, generalWhatsappLink, TIME_SLOTS } from "@/lib/site";
import { euro, formatDate, isValidEmail, isValidPhone, todayISO } from "@/lib/utils";
import { Button, ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Appointment as AppointmentRecord } from "@/lib/api";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const EMPTY: FormState = {
  fullName: "",
  phone: "",
  email: "",
  serviceId: "",
  preferredDate: "",
  preferredTime: "09:30",
  message: "",
};

export default function Appointment() {
  const { content, publishedServices, createAppointment } = useData();
  const clinic = content.clinic;
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<AppointmentRecord | null>(null);

  const requestedService = searchParams.get("service");

  useEffect(() => {
    setForm((current) => {
      if (current.serviceId) return current;
      const match = requestedService
        ? publishedServices.find((service) => service.slug === requestedService)
        : publishedServices[0];
      return match ? { ...current, serviceId: match.id } : current;
    });
  }, [publishedServices, requestedService]);

  const selectedService = publishedServices.find((service) => service.id === form.serviceId);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name.";
    if (!isValidPhone(form.phone)) nextErrors.phone = "Enter a reachable phone number.";
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.serviceId) nextErrors.serviceId = "Choose the treatment you need.";
    if (!form.preferredDate) {
      nextErrors.preferredDate = "Pick a preferred date.";
    } else if (form.preferredDate < todayISO()) {
      nextErrors.preferredDate = "Choose today or a later date.";
    } else if (new Date(`${form.preferredDate}T00:00:00`).getDay() === 0) {
      nextErrors.preferredDate = "We are closed on Sundays — Monday to Saturday works.";
    }
    if (!form.preferredTime) nextErrors.preferredTime = "Pick a preferred time.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const appointment = await createAppointment({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        serviceId: form.serviceId,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message,
      });
      setConfirmed(appointment);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmed(null);
    setForm({ ...EMPTY, serviceId: publishedServices[0]?.id ?? "" });
    setErrors({});
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-mist">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-200/35 blur-3xl" />
          <div className="absolute -left-20 bottom-[-6rem] h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-grid-soft opacity-[0.35]" style={{ backgroundSize: "56px 56px" }} />
        </div>

        <div className="container relative py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[12.5px] text-ink-400">
            <Link to="/" className="transition-colors hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink-600">Appointment</span>
          </nav>

          <p className="eyebrow mb-4">
            <span className="h-px w-6 bg-brand-400/70" />
            Appointments
          </p>
          <h1 className="max-w-2xl text-balance">Book your appointment</h1>
          <p className="mt-6 max-w-2xl text-pretty text-[16px] leading-relaxed text-ink-500">
            Tell us what you need and when suits you. Our patient care team confirms every request within one working
            day — usually within a few hours.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[13.5px] text-ink-500">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
              45-minute first consultation
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
              Evening and Saturday slots
            </li>
            <li className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
              No payment needed to reserve
            </li>
          </ul>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            {confirmed ? (
              <Reveal className="rounded-4xl border border-brand-100 bg-white p-8 shadow-card sm:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-3xl bg-brand-50 text-brand-600">
                  <CheckCircle2 className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <p className="eyebrow mt-6">Request received</p>
                <h2 className="mt-3 font-display text-3xl text-ink-900">
                  Thank you, {confirmed.fullName.split(" ")[0]}.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500">
                  We have your request for <strong className="font-medium text-ink-800">{confirmed.serviceName}</strong>{" "}
                  on {formatDate(confirmed.preferredDate, { weekday: "long", day: "numeric", month: "long" })} at{" "}
                  {confirmed.preferredTime}. A coordinator will confirm by phone or email within one working day.
                </p>

                <dl className="mt-8 grid gap-4 rounded-3xl border border-ink-100 bg-mist p-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Reference</dt>
                    <dd className="mt-1 font-display text-[15px] text-ink-900">{confirmed.id.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Status</dt>
                    <dd className="mt-1 font-display text-[15px] text-brand-700">Awaiting confirmation</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Treatment</dt>
                    <dd className="mt-1 text-[14px] text-ink-700">{confirmed.serviceName}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Preferred slot</dt>
                    <dd className="mt-1 text-[14px] text-ink-700">
                      {formatDate(confirmed.preferredDate, { day: "numeric", month: "short" })} · {confirmed.preferredTime}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonAnchor
                    href={bookingWhatsappLink(
                      clinic.whatsapp,
                      confirmed.fullName,
                      confirmed.serviceName,
                      confirmed.preferredDate,
                      confirmed.preferredTime,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    variant="whatsapp"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                    Confirm faster on WhatsApp
                  </ButtonAnchor>
                  <Button variant="secondary" size="lg" onClick={resetForm}>
                    Book another appointment
                  </Button>
                  <ButtonLink to="/" variant="ghost" size="lg">
                    Back to home
                  </ButtonLink>
                </div>

                <p className="mt-6 text-[12.5px] leading-relaxed text-ink-400">
                  Demo website: this request is stored in your browser so you can see it appear in the{" "}
                  <Link to="/admin" className="font-medium text-brand-700 underline">
                    clinic dashboard
                  </Link>
                  . Connect the form to your practice system to receive real bookings.
                </p>
              </Reveal>
            ) : (
              <form className="rounded-4xl border border-ink-100 bg-white p-7 shadow-card sm:p-9" onSubmit={handleSubmit} noValidate>
                <h2 className="font-display text-2xl text-ink-900">Appointment details</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">
                  Fields marked with <span className="text-brand-500">*</span> are required. We only use your details to
                  arrange this appointment.
                </p>

                <div className="mt-8 space-y-5">
                  <Field label="Full name" htmlFor="fullName" required error={errors.fullName}>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(event) => update("fullName", event.target.value)}
                      placeholder="Marieke Jansen"
                      autoComplete="name"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone" htmlFor="phone" required error={errors.phone}>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="+31 6 1234 5678"
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Email" htmlFor="email" required error={errors.email}>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <Field label="Treatment" htmlFor="serviceId" required error={errors.serviceId}>
                    <Select
                      id="serviceId"
                      value={form.serviceId}
                      onChange={(event) => update("serviceId", event.target.value)}
                    >
                      <option value="">Select a treatment…</option>
                      {publishedServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} — from {euro(service.priceFrom)}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  {selectedService ? (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-3xl border border-brand-100 bg-brand-50/60 px-5 py-4 text-[13px] text-ink-600">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                        {selectedService.duration}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                        from {euro(selectedService.priceFrom)}
                      </span>
                      <Link
                        to={`/services/${selectedService.slug}`}
                        className="inline-flex items-center gap-1 font-medium text-brand-700 hover:text-brand-800"
                      >
                        Treatment details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : null}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Preferred date" htmlFor="preferredDate" required error={errors.preferredDate}>
                      <Input
                        id="preferredDate"
                        type="date"
                        min={todayISO()}
                        value={form.preferredDate}
                        onChange={(event) => update("preferredDate", event.target.value)}
                      />
                    </Field>
                    <Field label="Preferred time" htmlFor="preferredTime" required error={errors.preferredTime}>
                      <Select
                        id="preferredTime"
                        value={form.preferredTime}
                        onChange={(event) => update("preferredTime", event.target.value)}
                      >
                        <option value="">Select a time…</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>

                  <Field
                    label="Message"
                    htmlFor="message"
                    hint="Symptoms, previous treatment, anxiety, insurance questions — anything that helps us prepare."
                  >
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(event) => update("message", event.target.value)}
                      placeholder="Optional — tell us anything we should know before your visit."
                    />
                  </Field>

                  <Button type="submit" variant="brand" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending request…
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                        Request appointment
                      </>
                    )}
                  </Button>

                  <p className="text-center text-[12px] leading-relaxed text-ink-400">
                    By requesting an appointment you agree to be contacted about this visit. Demo website — requests are
                    stored locally in your browser.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-4xl border border-ink-100 bg-mist p-7">
              <p className="eyebrow">
                <span className="h-px w-6 bg-brand-400/70" />
                What happens next
              </p>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: "We confirm your slot",
                    description: "A coordinator calls or emails within one working day to lock in the time.",
                  },
                  {
                    title: "You get a pre-visit checklist",
                    description: "Insurance details, medical history and what to bring — plus directions and parking.",
                  },
                  {
                    title: "45-minute diagnostic visit",
                    description: "Full imaging, a conversation about your goals and a written plan with fixed prices.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-200 bg-white font-display text-[11.5px] text-brand-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[14.5px] font-medium text-ink-800">{step.title}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.06} className="rounded-4xl border border-ink-100 bg-white p-7 shadow-soft">
              <h3 className="font-display text-lg text-ink-900">Prefer to book another way?</h3>
              <div className="mt-5 space-y-3">
                <ButtonAnchor
                  href={generalWhatsappLink(clinic.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="md"
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.9} />
                  Booking via WhatsApp
                </ButtonAnchor>
                <ButtonAnchor
                  href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.9} />
                  {clinic.phone}
                </ButtonAnchor>
              </div>

              <div className="mt-6 border-t border-ink-100 pt-5">
                <p className="flex items-center gap-2 text-[13px] font-medium text-ink-700">
                  <CalendarDays className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                  Opening hours
                </p>
                <dl className="mt-3 space-y-1.5 text-[13px]">
                  {clinic.hours.slice(0, 6).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between">
                      <dt className="text-ink-400">{entry.day}</dt>
                      <dd className="text-ink-600">{entry.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="rounded-4xl border border-brand-100 bg-white p-7">
              <p className="flex items-center gap-2 font-display text-[15px] text-ink-900">
                <ShieldCheck className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
                Dental emergency?
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{clinic.emergencyNote}</p>
              <p className="mt-3 text-[13.5px] text-ink-400">
                {clinic.street}, {clinic.postalCode} {clinic.city}
              </p>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
