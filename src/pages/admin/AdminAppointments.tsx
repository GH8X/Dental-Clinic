import { useMemo, useState } from "react";
import { CalendarPlus, Check, MessageCircle, Phone, Trash2, X } from "lucide-react";
import { useData } from "@/lib/data-context";
import { bookingWhatsappLink, TIME_SLOTS } from "@/lib/site";
import { APPOINTMENT_STATUSES, type Appointment as AppointmentRecord, type AppointmentStatus } from "@/lib/api";
import { cn, formatDate, formatDateTime, humanize, relativeDayLabel, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/slide-over";
import { EmptyState, Panel, SearchInput } from "./components";

const STATUS_FILTERS: Array<{ value: AppointmentStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  ...APPOINTMENT_STATUSES.map((status) => ({ value: status, label: humanize(status) })),
];

interface ManualForm {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

export default function AdminAppointments() {
  const { appointments, publishedServices, content, createAppointment, updateAppointment, deleteAppointment } =
    useData();
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AppointmentRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ManualForm>({
    fullName: "",
    phone: "",
    email: "",
    serviceId: "",
    preferredDate: todayISO(),
    preferredTime: "09:30",
    message: "",
  });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const matchesStatus = status === "all" || appointment.status === status;
      const matchesQuery =
        term.length === 0 ||
        [appointment.fullName, appointment.email, appointment.phone, appointment.serviceName]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesStatus && matchesQuery;
    });
  }, [appointments, query, status]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: appointments.length };
    for (const value of APPOINTMENT_STATUSES) {
      map[value] = appointments.filter((appointment) => appointment.status === value).length;
    }
    return map;
  }, [appointments]);

  const handleCreate = async () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.serviceId) return;
    setSaving(true);
    try {
      await createAppointment(form);
      setCreating(false);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        serviceId: "",
        preferredDate: todayISO(),
        preferredTime: "09:30",
        message: "",
      });
    } finally {
      setSaving(false);
    }
  };

  const setStatusFor = async (appointment: AppointmentRecord, next: AppointmentStatus) => {
    await updateAppointment(appointment.id, { status: next });
    setSelected((current) => (current && current.id === appointment.id ? { ...current, status: next } : current));
  };

  return (
    <div className="space-y-6">
      <Panel
        title="All appointment requests"
        description="Search, confirm or archive requests from the website and phone."
        action={
          <Button variant="brand" size="sm" onClick={() => setCreating(true)}>
            <CalendarPlus className="h-4 w-4" strokeWidth={1.9} />
            Add appointment
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search name, email, phone…" />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                  status === filter.value
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-500 hover:border-brand-200 hover:text-brand-700",
                )}
              >
                {filter.label}
                <span className="ml-2 text-[11.5px] text-ink-400">{counts[filter.value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState
              title="No appointments match"
              description="Try a different status filter or clear the search field to see every request."
            />
          ) : (
            <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[11.5px] uppercase tracking-[0.12em] text-ink-400">
                  <th className="px-4 pb-2 font-semibold">Patient</th>
                  <th className="px-4 pb-2 font-semibold">Contact</th>
                  <th className="px-4 pb-2 font-semibold">Treatment</th>
                  <th className="px-4 pb-2 font-semibold">Preferred slot</th>
                  <th className="px-4 pb-2 font-semibold">Status</th>
                  <th className="px-4 pb-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appointment) => (
                  <tr
                    key={appointment.id}
                    tabIndex={0}
                    className="cursor-pointer rounded-3xl bg-white text-[13.5px] shadow-[0_1px_2px_rgba(11,37,43,0.04)] transition-colors hover:bg-mist focus-visible:bg-mist"
                    onClick={() => setSelected(appointment)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(appointment);
                      }
                    }}
                  >
                    <td className="rounded-l-3xl border border-r-0 border-ink-100 px-4 py-3.5">
                      <p className="font-medium text-ink-900">{appointment.fullName}</p>
                      <p className="text-[12px] text-ink-400">{appointment.id.toUpperCase()}</p>
                    </td>
                    <td className="border-y border-ink-100 px-4 py-3.5">
                      <p className="text-ink-600">{appointment.phone}</p>
                      <p className="text-[12px] text-ink-400">{appointment.email}</p>
                    </td>
                    <td className="border-y border-ink-100 px-4 py-3.5 text-ink-600">{appointment.serviceName}</td>
                    <td className="border-y border-ink-100 px-4 py-3.5">
                      <p className="text-ink-700">{relativeDayLabel(appointment.preferredDate)}</p>
                      <p className="text-[12px] text-ink-400">{appointment.preferredTime}</p>
                    </td>
                    <td className="border-y border-ink-100 px-4 py-3.5">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="rounded-r-3xl border border-l-0 border-ink-100 px-4 py-3.5">
                      <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                        {appointment.status !== "confirmed" ? (
                          <button
                            type="button"
                            title="Confirm"
                            onClick={() => void setStatusFor(appointment, "confirmed")}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-brand-200 text-brand-600 transition-colors hover:bg-brand-50"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                          </button>
                        ) : null}
                        {appointment.status !== "cancelled" ? (
                          <button
                            type="button"
                            title="Cancel"
                            onClick={() => void setStatusFor(appointment, "cancelled")}
                            className="grid h-8 w-8 place-items-center rounded-xl border border-ink-200 text-ink-400 transition-colors hover:border-red-200 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>

      {/* Detail panel */}
      <SlideOver
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.fullName ?? "Appointment"}
        description={selected ? `${selected.serviceName} · ${selected.id.toUpperCase()}` : undefined}
        footer={
          selected ? (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  if (!window.confirm(`Delete the request from ${selected.fullName}?`)) return;
                  await deleteAppointment(selected.id);
                  setSelected(null);
                }}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                Delete
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>
                Close
              </Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={selected.status} />
              <span className="text-[12.5px] text-ink-400">Requested {formatDateTime(selected.createdAt)}</span>
            </div>

            <dl className="grid gap-4 rounded-3xl border border-ink-100 bg-mist p-5 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Preferred date</dt>
                <dd className="mt-1 text-[14px] text-ink-800">
                  {formatDate(selected.preferredDate, { weekday: "long", day: "numeric", month: "long" })}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Preferred time</dt>
                <dd className="mt-1 text-[14px] text-ink-800">{selected.preferredTime}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Phone</dt>
                <dd className="mt-1 text-[14px] text-ink-800">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Email</dt>
                <dd className="mt-1 break-all text-[14px] text-ink-800">{selected.email}</dd>
              </div>
            </dl>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Patient message</p>
              <p className="mt-2 rounded-3xl border border-ink-100 p-5 text-[14px] leading-relaxed text-ink-600">
                {selected.message || "No additional notes were provided with this request."}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Update status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {APPOINTMENT_STATUSES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => void setStatusFor(selected, value)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      selected.status === value
                        ? "border-brand-300 bg-brand-50 text-brand-700"
                        : "border-ink-200 text-ink-500 hover:border-brand-200 hover:text-brand-700",
                    )}
                  >
                    {humanize(value)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-ink-100 pt-6">
              <a
                href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2.5 text-[13.5px] text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                <Phone className="h-4 w-4" strokeWidth={1.8} />
                Call patient
              </a>
              <a
                href={bookingWhatsappLink(
                  content.clinic.whatsapp,
                  selected.fullName,
                  selected.serviceName,
                  selected.preferredDate,
                  selected.preferredTime,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2.5 text-[13.5px] text-brand-700 transition-colors hover:bg-brand-100"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                Reply on WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </SlideOver>

      {/* Manual creation */}
      <SlideOver
        open={creating}
        onClose={() => setCreating(false)}
        title="Add an appointment"
        description="Log a booking taken over the phone or at the front desk."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={() => void handleCreate()} disabled={saving}>
              {saving ? "Saving…" : "Create appointment"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Full name" htmlFor="manual-name" required>
            <Input
              id="manual-name"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              placeholder="Patient name"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="manual-phone" required>
              <Input
                id="manual-phone"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="+31 6 1234 5678"
              />
            </Field>
            <Field label="Email" htmlFor="manual-email" required>
              <Input
                id="manual-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="patient@example.com"
              />
            </Field>
          </div>
          <Field label="Treatment" htmlFor="manual-service" required>
            <Select
              id="manual-service"
              value={form.serviceId}
              onChange={(event) => setForm({ ...form, serviceId: event.target.value })}
            >
              <option value="">Select a treatment…</option>
              {publishedServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date" htmlFor="manual-date" required>
              <Input
                id="manual-date"
                type="date"
                value={form.preferredDate}
                onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
              />
            </Field>
            <Field label="Time" htmlFor="manual-time" required>
              <Select
                id="manual-time"
                value={form.preferredTime}
                onChange={(event) => setForm({ ...form, preferredTime: event.target.value })}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Notes" htmlFor="manual-message">
            <Textarea
              id="manual-message"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Anything the clinician should know."
            />
          </Field>
        </div>
      </SlideOver>
    </div>
  );
}
