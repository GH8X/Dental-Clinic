import { useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Info,
  MessageSquareQuote,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { formatDate, relativeDayLabel, todayISO } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, Panel, StatCard } from "./components";

export default function AdminDashboard() {
  const { appointments, approvedTestimonials, testimonials, services, doctors, content, mode, updateAppointment } =
    useData();
  const today = todayISO();

  const stats = useMemo(() => {
    const pending = appointments.filter((appointment) => appointment.status === "pending");
    const upcoming = appointments.filter(
      (appointment) =>
        appointment.preferredDate >= today && (appointment.status === "pending" || appointment.status === "confirmed"),
    );
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const thisWeek = upcoming.filter((appointment) => appointment.preferredDate <= weekEnd.toISOString().slice(0, 10));
    const rating = approvedTestimonials.length
      ? approvedTestimonials.reduce((total, item) => total + item.rating, 0) / approvedTestimonials.length
      : 0;

    return { pending, upcoming, thisWeek, rating };
  }, [appointments, approvedTestimonials, today]);

  const chart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const iso = date.toISOString().slice(0, 10);
      return {
        iso,
        label: date.toLocaleDateString("en-GB", { weekday: "short" }),
        count: stats.upcoming.filter((appointment) => appointment.preferredDate === iso).length,
      };
    });
    const max = Math.max(1, ...days.map((day) => day.count));
    return { days, max };
  }, [stats.upcoming]);

  const todayList = stats.upcoming.filter((appointment) => appointment.preferredDate === today);
  const pendingQueue = stats.pending.slice(0, 5);
  const unapproved = testimonials.filter((item) => !item.approved);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-brand-100 bg-white p-5 shadow-soft">
        <p className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
          {mode === "supabase"
            ? "Connected to Supabase — changes are stored in your Postgres project."
            : "Demo mode: everything you change here is saved in this browser. Add Supabase keys to run the same dashboard on a real database."}
        </p>
        <ButtonLink to="/admin/appointments" variant="secondary" size="sm">
          Open request queue
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
        </ButtonLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Awaiting confirmation"
          value={String(stats.pending.length)}
          hint="Requests submitted through the website"
          icon={<Clock className="h-5 w-5" strokeWidth={1.7} />}
          tone="amber"
        />
        <StatCard
          label="Upcoming appointments"
          value={String(stats.upcoming.length)}
          hint={`${stats.thisWeek.length} within the next 7 days`}
          icon={<CalendarDays className="h-5 w-5" strokeWidth={1.7} />}
        />
        <StatCard
          label="Patient rating"
          value={stats.rating ? `${stats.rating.toFixed(1)}/5` : "—"}
          hint={`${approvedTestimonials.length} published reviews`}
          icon={<Star className="h-5 w-5" strokeWidth={1.7} />}
          tone="blue"
        />
        <StatCard
          label="Published treatments"
          value={String(services.filter((service) => service.published).length)}
          hint={`${doctors.filter((doctor) => doctor.published).length} doctors live`}
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.7} />}
          tone="ink"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Requests to confirm" description="Newest website bookings first.">
          {pendingQueue.length === 0 ? (
            <EmptyState
              title="Nothing waiting"
              description="Every appointment request has been handled. New submissions from the website land here instantly."
            />
          ) : (
            <ul className="space-y-3">
              {pendingQueue.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink-100 bg-white p-4 transition-colors hover:border-brand-200"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium text-ink-900">
                      {appointment.fullName}
                      <StatusBadge status={appointment.status} />
                    </p>
                    <p className="mt-1 text-[13px] text-ink-400">
                      {appointment.serviceName} · {relativeDayLabel(appointment.preferredDate)} at{" "}
                      {appointment.preferredTime}
                    </p>
                    {appointment.message ? (
                      <p className="mt-2 line-clamp-1 max-w-md text-[13px] text-ink-500">“{appointment.message}”</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => void updateAppointment(appointment.id, { status: "confirmed" })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12.5px] font-medium text-brand-700 transition-colors hover:bg-brand-100"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateAppointment(appointment.id, { status: "cancelled" })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-[12.5px] font-medium text-ink-500 transition-colors hover:border-red-200 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Next 7 days" description="Confirmed and pending appointments per day.">
            <div className="flex h-40 items-end gap-3">
              {chart.days.map((day) => (
                <div key={day.iso} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[12px] font-medium text-ink-500">{day.count}</span>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-brand-500/70 to-brand-400"
                    style={{ height: `${Math.max(6, (day.count / chart.max) * 100)}%` }}
                  />
                  <span className="text-[11.5px] uppercase tracking-[0.08em] text-ink-400">{day.label}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Today's schedule"
            description={formatDate(today, { weekday: "long", day: "numeric", month: "long" })}
          >
            {todayList.length === 0 ? (
              <p className="text-[13.5px] text-ink-400">No appointments booked for today.</p>
            ) : (
              <ul className="space-y-3">
                {todayList.map((appointment) => (
                  <li key={appointment.id} className="flex items-center gap-4">
                    <span className="grid h-11 w-14 shrink-0 place-items-center rounded-2xl bg-mist font-display text-[13px] text-ink-700">
                      {appointment.preferredTime}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink-900">{appointment.fullName}</p>
                      <p className="truncate text-[12.5px] text-ink-400">{appointment.serviceName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Reviews needing approval" description={`${unapproved.length} waiting`}>
          {unapproved.length === 0 ? (
            <p className="text-[13.5px] text-ink-400">All reviews have been reviewed. Nice work.</p>
          ) : (
            <ul className="space-y-4">
              {unapproved.slice(0, 3).map((testimonial) => (
                <li key={testimonial.id} className="rounded-3xl border border-ink-100 p-4">
                  <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                    {testimonial.rating}/5 · {testimonial.patientName}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-500">“{testimonial.quote}”</p>
                </li>
              ))}
            </ul>
          )}
          <ButtonLink to="/admin/testimonials" variant="ghost" size="sm" className="mt-4 px-0">
            Manage testimonials
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
          </ButtonLink>
        </Panel>

        <Panel title="Quick actions" description="Most common daily tasks.">
          <div className="grid gap-3">
            {[
              { to: "/admin/services", label: "Add or edit a treatment", icon: <TrendingUp className="h-4 w-4" strokeWidth={1.8} /> },
              { to: "/admin/doctors", label: "Update doctor profiles", icon: <Users className="h-4 w-4" strokeWidth={1.8} /> },
              { to: "/admin/testimonials", label: "Publish patient reviews", icon: <MessageSquareQuote className="h-4 w-4" strokeWidth={1.8} /> },
              { to: "/admin/content", label: "Edit homepage copy", icon: <Info className="h-4 w-4" strokeWidth={1.8} /> },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center justify-between gap-3 rounded-3xl border border-ink-100 px-4 py-3 text-[13.5px] text-ink-700 transition-colors hover:border-brand-200 hover:bg-mist"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    {action.icon}
                  </span>
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4 text-ink-300" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Live website content" description="What patients currently see.">
          <dl className="space-y-4 text-[13.5px]">
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-3">
              <dt className="text-ink-400">Homepage headline</dt>
              <dd className="text-right font-medium text-ink-800">
                {content.hero.headline} {content.hero.highlight}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-3">
              <dt className="text-ink-400">Phone</dt>
              <dd className="text-right text-ink-700">{content.clinic.phone}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-3">
              <dt className="text-ink-400">WhatsApp</dt>
              <dd className="text-right text-ink-700">{content.clinic.whatsapp}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-ink-400">FAQs published</dt>
              <dd className="text-right text-ink-700">{content.faqs.length}</dd>
            </div>
          </dl>
          <ButtonLink to="/admin/content" variant="ghost" size="sm" className="mt-4 px-0">
            Edit website content
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
          </ButtonLink>
        </Panel>
      </div>
    </div>
  );
}
