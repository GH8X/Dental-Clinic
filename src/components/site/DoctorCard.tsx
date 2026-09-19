import { Award, GraduationCap, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doctor } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";
import { DoctorPortrait } from "@/components/ui/photo";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-ink-100/80 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
      <DoctorPortrait name={doctor.name} tone={doctor.tone} />

      <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
        <h3 className="font-display text-xl text-ink-900">{doctor.name}</h3>
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-600">{doctor.role}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {doctor.specialties.slice(0, 3).map((specialty) => (
            <span key={specialty} className="rounded-full bg-mist px-2.5 py-1 text-[11.5px] font-medium text-ink-500">
              {specialty}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-ink-500">{doctor.bio}</p>

        <dl className="mt-5 space-y-2 border-t border-ink-100 pt-5 text-[13px] text-ink-500">
          <div className="flex items-start gap-2.5">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
            <dd>{doctor.experienceYears} years of clinical experience</dd>
          </div>
          <div className="flex items-start gap-2.5">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
            <dd>{doctor.education.join(" · ")}</dd>
          </div>
          <div className="flex items-start gap-2.5">
            <Languages className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
            <dd>{doctor.languages.join(", ")}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-6">
          <ButtonLink to="/appointment" variant="secondary" size="sm" className="w-full">
            Request an appointment
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function DoctorMiniCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to="/doctors"
      className="group flex items-center gap-4 rounded-3xl border border-ink-100/80 bg-white p-3 pr-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <DoctorPortrait name={doctor.name} tone={doctor.tone} aspect="square" className="h-14 w-14 shrink-0 rounded-2xl" />
      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] text-ink-900">{doctor.name}</span>
        <span className="block truncate text-[12.5px] text-ink-400">{doctor.role}</span>
      </span>
    </Link>
  );
}
