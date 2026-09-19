import { useState, type ReactNode, type ReactElement } from "react";
import { Camera } from "lucide-react";
import { TONE_CLASSES, type Motif, type Tone } from "@/lib/api";
import { cn, initials } from "@/lib/utils";

/**
 * Illustrated stand-ins for professional photography.
 *
 * Each frame renders a soft duotone panel with a motif illustration. Pass `src`
 * and the frame swaps in a real photograph automatically - so replacing these
 * with a photographer's delivery is a one-prop change.
 */

const MOTIFS: Record<Motif, ReactElement> = {
  clinic: (
    <>
      <path d="M7 40h34" />
      <path d="M11 40V17h26v23" />
      <path d="M24 21v9M19.5 25.5h9" />
      <path d="M20 40v-7h8v7" />
    </>
  ),
  treatment: (
    <>
      <path d="M5 40h38" />
      <path d="M11 40V27a7 7 0 0 1 7-7h6l6 8h8a4 4 0 0 1 4 4v8" />
      <circle cx="14" cy="13" r="4.5" />
      <path d="M30 9l8 5" />
    </>
  ),
  smile: (
    <>
      <path d="M10 18c2 13 8 20 14 20s12-7 14-20" />
      <path d="M12 23h24" />
      <path d="M18 23v7M24 23v8M30 23v7" />
    </>
  ),
  team: (
    <>
      <circle cx="24" cy="15" r="5" />
      <path d="M14 39a10 10 0 0 1 20 0" />
      <circle cx="11" cy="20" r="4" />
      <path d="M3 38a8 8 0 0 1 7.5-8" />
      <circle cx="37" cy="20" r="4" />
      <path d="M45 38a8 8 0 0 0-7.5-8" />
    </>
  ),
  technology: (
    <>
      <rect x="8" y="9" width="32" height="23" rx="3" />
      <path d="M24 32v6M18 39h12" />
      <path d="M14 20.5h20" />
      <path d="M24 14v13" />
    </>
  ),
  kids: (
    <>
      <path d="M24 8l3.6 7.6 8.4 1-6.2 5.8 1.6 8.2L24 26.7 16.6 30.6l1.6-8.2-6.2-5.8 8.4-1z" />
      <path d="M15 37c3 2.5 6 3.5 9 3.5s6-1 9-3.5" />
    </>
  ),
  portrait: (
    <>
      <circle cx="24" cy="18" r="8" />
      <path d="M9 40c2.5-7 8.5-11 15-11s12.5 4 15 11" />
    </>
  ),
};

const ASPECTS = {
  wide: "aspect-[16/9]",
  video: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4.4]",
  none: "",
} as const;

interface PhotoFrameProps {
  tone?: Tone;
  motif?: Motif;
  label?: string;
  caption?: string;
  aspect?: keyof typeof ASPECTS;
  src?: string;
  alt?: string;
  tag?: boolean;
  className?: string;
  children?: ReactNode;
}

export function PhotoFrame({
  tone = "teal",
  motif = "clinic",
  label,
  caption,
  aspect = "video",
  src,
  alt,
  tag = true,
  className,
  children,
}: PhotoFrameProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const palette = TONE_CLASSES[tone];

  return (
    <figure
      className={cn(
        "group relative isolate overflow-hidden rounded-4xl bg-gradient-to-br ring-1 ring-inset",
        palette.panel,
        palette.ring,
        ASPECTS[aspect],
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? label ?? ""}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-14 -top-16 h-52 w-52 rounded-full bg-white/70 blur-2xl" />
            <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-brand-300/25 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #0B252B 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
            <span
              className={cn(
                "grid h-16 w-16 place-items-center rounded-3xl bg-white/85 shadow-soft ring-1 ring-inset backdrop-blur-sm transition-transform duration-500 group-hover:scale-105",
                palette.ring,
                palette.text,
              )}
            >
              <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                {MOTIFS[motif]}
              </svg>
            </span>
            {label ? (
              <p className="max-w-[16rem] text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">{label}</p>
            ) : null}
          </div>
        </>
      )}

      {tag && !showImage ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400 backdrop-blur">
          <Camera className="h-3 w-3" strokeWidth={2} />
          Photo
        </span>
      ) : null}

      {caption ? (
        <figcaption className="absolute inset-x-3 bottom-3 rounded-3xl bg-white/85 px-4 py-3 text-left text-[12.5px] leading-snug text-ink-600 backdrop-blur-md">
          {caption}
        </figcaption>
      ) : null}

      {children}
    </figure>
  );
}

interface DoctorPortraitProps {
  name: string;
  tone?: Tone;
  className?: string;
  aspect?: keyof typeof ASPECTS;
  src?: string;
}

export function DoctorPortrait({ name, tone = "teal", className, aspect = "portrait", src }: DoctorPortraitProps) {
  const [failed, setFailed] = useState(false);
  const palette = TONE_CLASSES[tone];
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-4xl bg-gradient-to-br ring-1 ring-inset",
        palette.panel,
        palette.ring,
        ASPECTS[aspect],
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #0B252B 1px, transparent 0)",
              backgroundSize: "14px 14px",
            }}
          />
          <svg
            aria-hidden
            viewBox="0 0 120 120"
            className="absolute -bottom-3 left-1/2 h-[78%] w-[78%] -translate-x-1/2 fill-white/70"
          >
            <circle cx="60" cy="42" r="21" />
            <path d="M10 120c0-27 22-43 50-43s50 16 50 43z" />
          </svg>
          <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 font-display text-3xl tracking-tight text-ink-900/45">
            {initials(name)}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400 backdrop-blur">
            <Camera className="h-3 w-3" strokeWidth={2} />
            Portrait
          </span>
        </>
      )}
    </div>
  );
}
