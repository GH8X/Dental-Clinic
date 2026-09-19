import { useState } from "react";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { useData } from "@/lib/data-context";
import type { Service } from "@/lib/api";
import { euro, slugify, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Icon, ICON_KEYS } from "@/components/ui/icon";
import { SlideOver } from "@/components/ui/slide-over";
import { EmptyState, Panel, SavingIndicator, Toggle } from "./components";

function blankService(order: number): Service {
  return {
    id: uid("svc"),
    slug: "",
    name: "",
    tagline: "",
    description: "",
    duration: "1 visit · 30 min",
    priceFrom: 100,
    icon: "tooth",
    highlights: [],
    featured: false,
    published: true,
    order,
  };
}

export default function AdminServices() {
  const { services, saveService, removeRecord } = useData();
  const [draft, setDraft] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  const persist = async (service: Service) => {
    setSaving(true);
    try {
      await saveService({ ...service, slug: service.slug || slugify(service.name) });
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (service: Service, patch: Partial<Service>) => {
    await saveService({ ...service, ...patch });
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Treatments"
        description="Everything published here appears on the website, in the booking form and in the footer."
        action={
          <Button variant="brand" size="sm" onClick={() => setDraft(blankService(services.length + 1))}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add treatment
          </Button>
        }
      >
        {services.length === 0 ? (
          <EmptyState title="No treatments yet" description="Add your first treatment to populate the website." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex flex-col gap-4 rounded-3xl border border-ink-100 bg-white p-5 transition-colors hover:border-brand-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                      <Icon name={service.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display text-[16.5px] text-ink-900">
                        {service.name || "Untitled treatment"}
                        {service.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brand-600">
                            <Sparkles className="h-3 w-3" strokeWidth={2} />
                            Featured
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-400">{service.tagline || "No tagline yet"}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block font-display text-[15px] text-ink-900">{euro(service.priceFrom)}</span>
                    <span className="block text-[11.5px] text-ink-400">{service.duration}</span>
                  </p>
                </div>

                <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-500">{service.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-4">
                  <div className="flex flex-wrap gap-5">
                    <Toggle
                      checked={service.published}
                      onChange={(checked) => void toggle(service, { published: checked })}
                      label={service.published ? "Published" : "Hidden"}
                    />
                    <Toggle
                      checked={service.featured}
                      onChange={(checked) => void toggle(service, { featured: checked })}
                      label="Featured"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setDraft(service)}>
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Delete “${service.name}”?`)) void removeRecord("services", service.id);
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
      </Panel>

      <SlideOver
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        title={draft?.name ? `Edit ${draft.name}` : "New treatment"}
        description="Changes go live on the website immediately after saving."
        width="lg"
        footer={
          draft ? (
            <>
              <SavingIndicator saving={saving} />
              <Button variant="secondary" size="sm" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button variant="brand" size="sm" onClick={() => void persist(draft)} disabled={saving || !draft.name}>
                Save treatment
              </Button>
            </>
          ) : null
        }
      >
        {draft ? (
          <div className="space-y-5">
            <Field label="Treatment name" htmlFor="svc-name" required>
              <Input
                id="svc-name"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="Dental Implants"
              />
            </Field>

            <Field label="Tagline" htmlFor="svc-tagline" hint="One line shown under the name on cards.">
              <Input
                id="svc-tagline"
                value={draft.tagline}
                onChange={(event) => setDraft({ ...draft, tagline: event.target.value })}
                placeholder="Permanent replacements that look and feel like your own teeth"
              />
            </Field>

            <Field label="Description" htmlFor="svc-description">
              <Textarea
                id="svc-description"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                placeholder="Explain the treatment in two or three patient-friendly sentences."
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Price from (€)" htmlFor="svc-price" required>
                <Input
                  id="svc-price"
                  type="number"
                  min={0}
                  value={draft.priceFrom}
                  onChange={(event) => setDraft({ ...draft, priceFrom: Number(event.target.value) })}
                />
              </Field>
              <Field label="Duration" htmlFor="svc-duration">
                <Input
                  id="svc-duration"
                  value={draft.duration}
                  onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
                  placeholder="1 visit · 60 min"
                />
              </Field>
              <Field label="Icon" htmlFor="svc-icon">
                <Select
                  id="svc-icon"
                  value={draft.icon}
                  onChange={(event) => setDraft({ ...draft, icon: event.target.value })}
                >
                  {ICON_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Highlights" htmlFor="svc-highlights" hint="One bullet point per line.">
              <Textarea
                id="svc-highlights"
                value={draft.highlights.join("\n")}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    highlights: event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={"Digital 3D scan and guided placement\n10-year implant warranty"}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Display order" htmlFor="svc-order" hint="Lower numbers appear first.">
                <Input
                  id="svc-order"
                  type="number"
                  min={1}
                  value={draft.order}
                  onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
                />
              </Field>
              <div className="flex items-end gap-6 pb-2">
                <Toggle
                  checked={draft.published}
                  onChange={(checked) => setDraft({ ...draft, published: checked })}
                  label="Published"
                />
                <Toggle
                  checked={draft.featured}
                  onChange={(checked) => setDraft({ ...draft, featured: checked })}
                  label="Featured on home"
                />
              </div>
            </div>

            <p className="rounded-2xl border border-ink-100 bg-mist px-4 py-3 text-[12.5px] text-ink-400">
              Website URL: /services/{draft.slug || slugify(draft.name) || "treatment-name"}
            </p>
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
