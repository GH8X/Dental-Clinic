import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useData } from "@/lib/data-context";
import type { Doctor, Tone } from "@/lib/api";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { DoctorPortrait } from "@/components/ui/photo";
import { SlideOver } from "@/components/ui/slide-over";
import { EmptyState, Panel, SavingIndicator, Toggle } from "./components";

const TONES: Tone[] = ["teal", "blue", "mint", "sand", "sky", "ink"];

function blankDoctor(order: number): Doctor {
  return {
    id: uid("doc"),
    name: "",
    role: "",
    specialties: [],
    bio: "",
    experienceYears: 5,
    education: [],
    languages: ["Dutch", "English"],
    tone: "teal",
    published: true,
    order,
  };
}

const csv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const listify = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminDoctors() {
  const { doctors, saveDoctor, removeRecord } = useData();
  const [draft, setDraft] = useState<Doctor | null>(null);
  const [saving, setSaving] = useState(false);

  const persist = async (doctor: Doctor) => {
    setSaving(true);
    try {
      await saveDoctor(doctor);
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Clinical team"
        description="Profiles shown on the home page, the doctors page and the treatment sidebars."
        action={
          <Button variant="brand" size="sm" onClick={() => setDraft(blankDoctor(doctors.length + 1))}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add doctor
          </Button>
        }
      >
        {doctors.length === 0 ? (
          <EmptyState title="No team members yet" description="Add your clinicians so patients know who they will see." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="flex gap-5 rounded-3xl border border-ink-100 bg-white p-5 transition-colors hover:border-brand-200"
              >
                <DoctorPortrait name={doctor.name || "New"} tone={doctor.tone} aspect="square" className="h-24 w-24 shrink-0 rounded-3xl" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[16.5px] text-ink-900">{doctor.name || "Unnamed doctor"}</p>
                      <p className="truncate text-[12.5px] font-medium uppercase tracking-[0.1em] text-brand-600">
                        {doctor.role || "Role not set"}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-ink-400">
                      {doctor.experienceYears} yrs
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
                    {doctor.bio || "No profile text yet."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {doctor.specialties.slice(0, 3).map((item) => (
                      <span key={item} className="rounded-full bg-mist px-2.5 py-1 text-[11.5px] text-ink-500">
                        {item}
                      </span>
                    ))}
                    {doctor.languages.length > 0 ? (
                      <span className="rounded-full bg-mist px-2.5 py-1 text-[11.5px] text-ink-500">
                        {doctor.languages.join(" · ")}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                    <Toggle
                      checked={doctor.published}
                      onChange={(checked) => void saveDoctor({ ...doctor, published: checked })}
                      label={doctor.published ? "Published" : "Hidden"}
                    />
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setDraft(doctor)}>
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Remove ${doctor.name} from the team page?`)) {
                            void removeRecord("doctors", doctor.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </Button>
                    </div>
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
        title={draft?.name ? `Edit ${draft.name}` : "New team member"}
        description="Profiles appear immediately on the public website."
        width="lg"
        footer={
          draft ? (
            <>
              <SavingIndicator saving={saving} />
              <Button variant="secondary" size="sm" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button variant="brand" size="sm" onClick={() => void persist(draft)} disabled={saving || !draft.name}>
                Save profile
              </Button>
            </>
          ) : null
        }
      >
        {draft ? (
          <div className="space-y-5">
            <div className="flex items-center gap-5 rounded-3xl border border-ink-100 bg-mist p-4">
              <DoctorPortrait name={draft.name || "New"} tone={draft.tone} aspect="square" className="h-20 w-20 shrink-0 rounded-3xl" />
              <div className="text-[13px] text-ink-500">
                Portrait placeholder — pass a photo URL in the code to replace it with a real headshot.
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="doc-name" required>
                <Input
                  id="doc-name"
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="Dr. Anna Vermeer"
                />
              </Field>
              <Field label="Role" htmlFor="doc-role">
                <Input
                  id="doc-role"
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  placeholder="Founder & Implantologist"
                />
              </Field>
            </div>

            <Field label="Biography" htmlFor="doc-bio" hint="Two to three sentences in a warm, factual tone.">
              <Textarea
                id="doc-bio"
                value={draft.bio}
                onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                placeholder="Where they trained, what they focus on and what patients should know."
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Specialities" htmlFor="doc-specialties" hint="Comma separated.">
                <Input
                  id="doc-specialties"
                  value={draft.specialties.join(", ")}
                  onChange={(event) => setDraft({ ...draft, specialties: csv(event.target.value) })}
                  placeholder="Implantology, Oral surgery"
                />
              </Field>
              <Field label="Languages" htmlFor="doc-languages" hint="Comma separated.">
                <Input
                  id="doc-languages"
                  value={draft.languages.join(", ")}
                  onChange={(event) => setDraft({ ...draft, languages: csv(event.target.value) })}
                  placeholder="Dutch, English, German"
                />
              </Field>
            </div>

            <Field label="Education & training" htmlFor="doc-education" hint="One qualification per line.">
              <Textarea
                id="doc-education"
                value={draft.education.join("\n")}
                onChange={(event) => setDraft({ ...draft, education: listify(event.target.value) })}
                placeholder={"DDS, University of Amsterdam\nMSc Implantology, ACTA Amsterdam"}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Years of experience" htmlFor="doc-years">
                <Input
                  id="doc-years"
                  type="number"
                  min={0}
                  value={draft.experienceYears}
                  onChange={(event) => setDraft({ ...draft, experienceYears: Number(event.target.value) })}
                />
              </Field>
              <Field label="Portrait tone" htmlFor="doc-tone">
                <Select
                  id="doc-tone"
                  value={draft.tone}
                  onChange={(event) => setDraft({ ...draft, tone: event.target.value as Tone })}
                >
                  {TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Display order" htmlFor="doc-order">
                <Input
                  id="doc-order"
                  type="number"
                  min={1}
                  value={draft.order}
                  onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
                />
              </Field>
            </div>

            <Toggle
              checked={draft.published}
              onChange={(checked) => setDraft({ ...draft, published: checked })}
              label="Show on the website"
            />
          </div>
        ) : null}
      </SlideOver>
    </div>
  );
}
