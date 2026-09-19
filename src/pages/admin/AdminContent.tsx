import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useData } from "@/lib/data-context";
import type { SiteContent, Tone } from "@/lib/api";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Panel } from "./components";

const TONES: Tone[] = ["teal", "blue", "mint", "sand", "sky", "ink"];

function RowShell({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <div className="relative rounded-3xl border border-ink-100 bg-white p-4 pb-5">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove item"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-xl border border-ink-200 text-ink-400 transition-colors hover:border-red-200 hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
      </button>
      <div className="pr-10">{children}</div>
    </div>
  );
}

export default function AdminContent() {
  const { content, saveContent, resetDemoData } = useData();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [content, draft]);

  useEffect(() => {
    if (!dirty) setDraft(content);
  }, [content, dirty]);

  const save = async () => {
    setSaving(true);
    try {
      await saveContent(draft);
    } finally {
      setSaving(false);
    }
  };

  const setHero = (patch: Partial<SiteContent["hero"]>) => setDraft((current) => ({ ...current, hero: { ...current.hero, ...patch } }));
  const setCta = (patch: Partial<SiteContent["finalCta"]>) =>
    setDraft((current) => ({ ...current, finalCta: { ...current.finalCta, ...patch } }));
  const setBrand = (patch: Partial<SiteContent["brand"]>) =>
    setDraft((current) => ({ ...current, brand: { ...current.brand, ...patch } }));
  const setClinic = (patch: Partial<SiteContent["clinic"]>) =>
    setDraft((current) => ({ ...current, clinic: { ...current.clinic, ...patch } }));

  return (
    <div className="space-y-6 pb-24">
      <Panel title="Homepage hero" description="The first thing every visitor reads.">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Eyebrow label" htmlFor="hero-eyebrow">
              <Input id="hero-eyebrow" value={draft.hero.eyebrow} onChange={(event) => setHero({ eyebrow: event.target.value })} />
            </Field>
            <Field label="Secondary button label" htmlFor="hero-secondary">
              <Input
                id="hero-secondary"
                value={draft.hero.secondaryCta}
                onChange={(event) => setHero({ secondaryCta: event.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Headline" htmlFor="hero-headline" hint="Rendered in the display serif.">
              <Input id="hero-headline" value={draft.hero.headline} onChange={(event) => setHero({ headline: event.target.value })} />
            </Field>
            <Field label="Highlighted headline part" htmlFor="hero-highlight" hint="Shown in italic brand teal.">
              <Input
                id="hero-highlight"
                value={draft.hero.highlight}
                onChange={(event) => setHero({ highlight: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Subheadline" htmlFor="hero-subheadline">
            <Textarea
              id="hero-subheadline"
              value={draft.hero.subheadline}
              onChange={(event) => setHero({ subheadline: event.target.value })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Primary button label" htmlFor="hero-primary">
              <Input id="hero-primary" value={draft.hero.primaryCta} onChange={(event) => setHero({ primaryCta: event.target.value })} />
            </Field>
            <Field label="Trust line under the buttons" htmlFor="hero-note">
              <Input id="hero-note" value={draft.hero.note} onChange={(event) => setHero({ note: event.target.value })} />
            </Field>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-brand-50/50 p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-700">Live preview</p>
            <p className="mt-3 font-display text-2xl leading-snug text-ink-900">
              {draft.hero.headline} <span className="italic text-brand-600">{draft.hero.highlight}</span>
            </p>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-ink-500">{draft.hero.subheadline}</p>
          </div>
        </div>
      </Panel>

      <Panel title="Closing call to action" description="Shown at the bottom of every page.">
        <div className="grid gap-5">
          <Field label="Headline" htmlFor="cta-headline">
            <Input id="cta-headline" value={draft.finalCta.headline} onChange={(event) => setCta({ headline: event.target.value })} />
          </Field>
          <Field label="Description" htmlFor="cta-description">
            <Textarea
              id="cta-description"
              value={draft.finalCta.description}
              onChange={(event) => setCta({ description: event.target.value })}
            />
          </Field>
          <Field label="Note under the buttons" htmlFor="cta-note">
            <Input id="cta-note" value={draft.finalCta.note} onChange={(event) => setCta({ note: event.target.value })} />
          </Field>
        </div>
      </Panel>

      <Panel title="Practice details" description="Used in the header, footer, contact page and WhatsApp links.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Practice name" htmlFor="clinic-name">
            <Input id="clinic-name" value={draft.brand.name} onChange={(event) => setBrand({ name: event.target.value })} />
          </Field>
          <Field label="Tagline" htmlFor="clinic-tagline">
            <Input id="clinic-tagline" value={draft.brand.tagline} onChange={(event) => setBrand({ tagline: event.target.value })} />
          </Field>
          <Field label="Phone" htmlFor="clinic-phone">
            <Input id="clinic-phone" value={draft.clinic.phone} onChange={(event) => setClinic({ phone: event.target.value })} />
          </Field>
          <Field label="WhatsApp number" htmlFor="clinic-whatsapp" hint="International format, e.g. +31 6 1234 5678.">
            <Input
              id="clinic-whatsapp"
              value={draft.clinic.whatsapp}
              onChange={(event) => setClinic({ whatsapp: event.target.value })}
            />
          </Field>
          <Field label="Email" htmlFor="clinic-email">
            <Input id="clinic-email" value={draft.clinic.email} onChange={(event) => setClinic({ email: event.target.value })} />
          </Field>
          <Field label="Street" htmlFor="clinic-street">
            <Input id="clinic-street" value={draft.clinic.street} onChange={(event) => setClinic({ street: event.target.value })} />
          </Field>
          <Field label="Postal code" htmlFor="clinic-postal">
            <Input
              id="clinic-postal"
              value={draft.clinic.postalCode}
              onChange={(event) => setClinic({ postalCode: event.target.value })}
            />
          </Field>
          <Field label="City" htmlFor="clinic-city">
            <Input id="clinic-city" value={draft.clinic.city} onChange={(event) => setClinic({ city: event.target.value })} />
          </Field>
          <Field label="Google Maps search query" htmlFor="clinic-maps" className="sm:col-span-2">
            <Input id="clinic-maps" value={draft.clinic.mapsQuery} onChange={(event) => setClinic({ mapsQuery: event.target.value })} />
          </Field>
          <Field label="Emergency note" htmlFor="clinic-emergency" className="sm:col-span-2">
            <Textarea
              id="clinic-emergency"
              value={draft.clinic.emergencyNote}
              onChange={(event) => setClinic({ emergencyNote: event.target.value })}
              className="min-h-[80px]"
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Opening hours"
        description="Shown in the footer, contact page and booking sidebar."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setClinic({ hours: [...draft.clinic.hours, { id: uid("hr"), day: "New day", hours: "09:00 – 17:00" }] })
            }
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add row
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {draft.clinic.hours.map((entry) => (
            <RowShell
              key={entry.id}
              onRemove={() => setClinic({ hours: draft.clinic.hours.filter((item) => item.id !== entry.id) })}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  aria-label="Day"
                  value={entry.day}
                  onChange={(event) =>
                    setClinic({
                      hours: draft.clinic.hours.map((item) =>
                        item.id === entry.id ? { ...item, day: event.target.value } : item,
                      ),
                    })
                  }
                />
                <Input
                  aria-label="Hours"
                  value={entry.hours}
                  onChange={(event) =>
                    setClinic({
                      hours: draft.clinic.hours.map((item) =>
                        item.id === entry.id ? { ...item, hours: event.target.value } : item,
                      ),
                    })
                  }
                />
              </div>
            </RowShell>
          ))}
        </div>
      </Panel>

      <Panel
        title="Trust indicators & statistics"
        description="Badges in the hero area and the numbers shown on the home and about pages."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDraft((current) => ({ ...current, stats: [...current.stats, { id: uid("st"), value: "0", label: "New statistic" }] }))}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add statistic
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {draft.stats.map((stat) => (
            <RowShell
              key={stat.id}
              onRemove={() => setDraft((current) => ({ ...current, stats: current.stats.filter((item) => item.id !== stat.id) }))}
            >
              <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
                <Input
                  aria-label="Value"
                  value={stat.value}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      stats: current.stats.map((item) => (item.id === stat.id ? { ...item, value: event.target.value } : item)),
                    }))
                  }
                />
                <Input
                  aria-label="Label"
                  value={stat.label}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      stats: current.stats.map((item) => (item.id === stat.id ? { ...item, label: event.target.value } : item)),
                    }))
                  }
                />
              </div>
            </RowShell>
          ))}
        </div>

        <div className="mt-5">
          <Field label="Trust indicators" htmlFor="content-trust" hint="One per line. Displayed under the hero.">
            <Textarea
              id="content-trust"
              value={draft.trust.join("\n")}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  trust: event.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                }))
              }
              className="min-h-[100px]"
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Frequently asked questions"
        description="Shown on the home page, services page and contact page."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                faqs: [...current.faqs, { id: uid("faq"), question: "New question", answer: "" }],
              }))
            }
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add FAQ
          </Button>
        }
      >
        <div className="grid gap-4">
          {draft.faqs.map((faq) => (
            <RowShell
              key={faq.id}
              onRemove={() => setDraft((current) => ({ ...current, faqs: current.faqs.filter((item) => item.id !== faq.id) }))}
            >
              <div className="grid gap-3">
                <Input
                  aria-label="Question"
                  value={faq.question}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, question: event.target.value } : item)),
                    }))
                  }
                />
                <Textarea
                  aria-label="Answer"
                  value={faq.answer}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      faqs: current.faqs.map((item) => (item.id === faq.id ? { ...item, answer: event.target.value } : item)),
                    }))
                  }
                />
              </div>
            </RowShell>
          ))}
        </div>
      </Panel>

      <Panel
        title="Gallery & before/after"
        description="Image slots on the gallery page and the comparison sliders on the home page."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                gallery: [
                  ...current.gallery,
                  {
                    id: uid("gal"),
                    title: "New image slot",
                    caption: "Describe what the photograph shows.",
                    category: "Clinic",
                    tone: "teal",
                    motif: "clinic",
                  },
                ],
              }))
            }
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add image
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.gallery.map((item) => (
            <RowShell
              key={item.id}
              onRemove={() =>
                setDraft((current) => ({ ...current, gallery: current.gallery.filter((entry) => entry.id !== item.id) }))
              }
            >
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    aria-label="Title"
                    value={item.title}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        gallery: current.gallery.map((entry) =>
                          entry.id === item.id ? { ...entry, title: event.target.value } : entry,
                        ),
                      }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      aria-label="Category"
                      value={item.category}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          gallery: current.gallery.map((entry) =>
                            entry.id === item.id ? { ...entry, category: event.target.value } : entry,
                          ),
                        }))
                      }
                    />
                    <Select
                      aria-label="Tone"
                      value={item.tone}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          gallery: current.gallery.map((entry) =>
                            entry.id === item.id ? { ...entry, tone: event.target.value as Tone } : entry,
                          ),
                        }))
                      }
                    >
                      {TONES.map((tone) => (
                        <option key={tone} value={tone}>
                          {tone}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <Textarea
                  aria-label="Caption"
                  value={item.caption}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      gallery: current.gallery.map((entry) =>
                        entry.id === item.id ? { ...entry, caption: event.target.value } : entry,
                      ),
                    }))
                  }
                  className="min-h-[70px]"
                />
              </div>
            </RowShell>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg text-ink-900">Before & after cases</h3>
        <div className="mt-4 grid gap-4">
          {draft.beforeAfter.map((item) => (
            <RowShell
              key={item.id}
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  beforeAfter: current.beforeAfter.filter((entry) => entry.id !== item.id),
                }))
              }
            >
              <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
                <Input
                  aria-label="Treatment"
                  value={item.treatment}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      beforeAfter: current.beforeAfter.map((entry) =>
                        entry.id === item.id ? { ...entry, treatment: event.target.value } : entry,
                      ),
                    }))
                  }
                />
                <Input
                  aria-label="Duration"
                  value={item.duration}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      beforeAfter: current.beforeAfter.map((entry) =>
                        entry.id === item.id ? { ...entry, duration: event.target.value } : entry,
                      ),
                    }))
                  }
                />
                <Select
                  aria-label="Tone"
                  value={item.tone}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      beforeAfter: current.beforeAfter.map((entry) =>
                        entry.id === item.id ? { ...entry, tone: event.target.value as Tone } : entry,
                      ),
                    }))
                  }
                >
                  {TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea
                aria-label="Summary"
                value={item.summary}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    beforeAfter: current.beforeAfter.map((entry) =>
                      entry.id === item.id ? { ...entry, summary: event.target.value } : entry,
                    ),
                  }))
                }
                className="mt-3 min-h-[70px]"
              />
            </RowShell>
          ))}
        </div>
      </Panel>

      <Panel title="Restore demo content" description="Revert every change - treatments, team, reviews and copy.">
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            if (window.confirm("Restore the original demo content? All edits will be lost.")) {
              void resetDemoData();
            }
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.9} />
          Reset everything to demo content
        </Button>
      </Panel>

      {dirty ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
            <p className="text-[13.5px] text-ink-500">
              You have <span className="font-medium text-ink-900">unsaved changes</span> to the website content.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => setDraft(content)}>
                Discard
              </Button>
              <Button variant="brand" size="sm" onClick={() => void save()} disabled={saving}>
                <Save className="h-3.5 w-3.5" strokeWidth={1.9} />
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
