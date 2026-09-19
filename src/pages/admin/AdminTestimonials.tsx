import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useData } from "@/lib/data-context";
import type { Testimonial } from "@/lib/api";
import { cn, formatDate, initials, todayISO, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SlideOver } from "@/components/ui/slide-over";
import { Stars } from "@/components/ui/stars";
import { EmptyState, Panel, SavingIndicator, Toggle } from "./components";

type Filter = "all" | "published" | "pending";

function blankTestimonial(): Testimonial {
  return {
    id: uid("tst"),
    patientName: "",
    city: "Amsterdam",
    rating: 5,
    quote: "",
    service: "",
    date: todayISO(),
    approved: false,
  };
}

export default function AdminTestimonials() {
  const { testimonials, publishedServices, saveTestimonial, removeRecord } = useData();
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "published") return testimonials.filter((item) => item.approved);
    if (filter === "pending") return testimonials.filter((item) => !item.approved);
    return testimonials;
  }, [filter, testimonials]);

  const persist = async (testimonial: Testimonial) => {
    setSaving(true);
    try {
      await saveTestimonial(testimonial);
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  const average = testimonials.length
    ? testimonials.reduce((total, item) => total + item.rating, 0) / testimonials.length
    : 0;

  return (
    <div className="space-y-6">
      <Panel
        title="Patient testimonials"
        description={`${testimonials.filter((item) => item.approved).length} published · average ${average.toFixed(1)}/5`}
        action={
          <Button
            variant="brand"
            size="sm"
            onClick={() => {
              setDraft(blankTestimonial());
            }}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add testimonial
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "pending", label: "Awaiting approval" },
            ] as Array<{ value: Filter; label: string }>
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                filter === option.value
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-ink-200 bg-white text-ink-500 hover:border-brand-200 hover:text-brand-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="Reviews submitted from the website land here first, so a human can approve them before they go live."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className={cn(
                    "rounded-3xl border bg-white p-5 transition-colors",
                    testimonial.approved ? "border-ink-100 hover:border-brand-200" : "border-amber-200 bg-amber-50/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 font-display text-[13px] text-brand-700">
                        {initials(testimonial.patientName || "New")}
                      </span>
                      <div>
                        <p className="font-display text-[16px] text-ink-900">
                          {testimonial.patientName || "Unnamed patient"}
                        </p>
                        <p className="text-[12.5px] text-ink-400">
                          {testimonial.city} · {formatDate(testimonial.date, { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Stars rating={testimonial.rating} />
                  </div>

                  <p className="mt-4 text-[13.5px] leading-relaxed text-ink-600">“{testimonial.quote}”</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                    <span className="rounded-full bg-mist px-3 py-1 text-[11.5px] text-ink-500">
                      {testimonial.service || "General"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void saveTestimonial({ ...testimonial, approved: !testimonial.approved })}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                          testimonial.approved
                            ? "border-ink-200 text-ink-500 hover:border-amber-200 hover:text-amber-700"
                            : "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100",
                        )}
                      >
                        {testimonial.approved ? (
                          <>
                            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                            Approve
                          </>
                        )}
                      </button>
                      <Button variant="secondary" size="sm" onClick={() => setDraft(testimonial)}>
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Delete this testimonial?")) void removeRecord("testimonials", testimonial.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <SlideOver
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        title={draft?.patientName ? `Edit review` : "New testimonial"}
        description="Only published reviews appear on the public website."
        footer={
          draft ? (
            <>
              <SavingIndicator saving={saving} />
              <Button variant="secondary" size="sm" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={() => void persist(draft)}
                disabled={saving || !draft.patientName || !draft.quote}
              >
                Save testimonial
              </Button>
            </>
          ) : null
        }
      >
        {draft ? (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Patient name" htmlFor="tst-name" required>
                <Input
                  id="tst-name"
                  value={draft.patientName}
                  onChange={(event) => setDraft({ ...draft, patientName: event.target.value })}
                  placeholder="Marieke Jansen"
                />
              </Field>
              <Field label="City" htmlFor="tst-city">
                <Input
                  id="tst-city"
                  value={draft.city}
                  onChange={(event) => setDraft({ ...draft, city: event.target.value })}
                  placeholder="Amsterdam"
                />
              </Field>
            </div>

            <Field label="Review" htmlFor="tst-quote" required>
              <Textarea
                id="tst-quote"
                value={draft.quote}
                onChange={(event) => setDraft({ ...draft, quote: event.target.value })}
                placeholder="What the patient said, in their own words."
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Rating" htmlFor="tst-rating">
                <Select
                  id="tst-rating"
                  value={String(draft.rating)}
                  onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value === 1 ? "" : "s"}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Treatment" htmlFor="tst-service">
                <Select
                  id="tst-service"
                  value={draft.service}
                  onChange={(event) => setDraft({ ...draft, service: event.target.value })}
                >
                  <option value="">General</option>
                  {publishedServices.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Date" htmlFor="tst-date">
                <Input
                  id="tst-date"
                  type="date"
                  value={draft.date}
                  onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                />
              </Field>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-ink-100 bg-mist px-5 py-4">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
              <Toggle
                checked={draft.approved}
                onChange={(checked) => setDraft({ ...draft, approved: checked })}
                label={draft.approved ? "Published on the website" : "Hidden until approved"}
              />
            </div>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
