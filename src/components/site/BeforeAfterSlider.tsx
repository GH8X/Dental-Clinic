import { MoveHorizontal, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { TONE_CLASSES, type BeforeAfterCase, type Tone } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ToothGlyph } from "@/components/layout/brand";

interface PanelProps {
  label: string;
  tone: Tone;
  bright?: boolean;
}

function ComparisonPanel({ label, tone, bright = false }: PanelProps) {
  const palette = TONE_CLASSES[tone];

  return (
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-br",
        palette.panel,
        bright ? "" : "saturate-[0.45]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0B252B 1px, transparent 0)",
          backgroundSize: "15px 15px",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl" />

      <div className="relative flex h-full w-full items-center justify-center">
        <span
          className={cn(
            "grid h-20 w-20 place-items-center rounded-full bg-white/85 shadow-soft ring-1 ring-inset backdrop-blur-sm",
            palette.ring,
            palette.text,
          )}
        >
          {bright ? <Sparkles className="h-8 w-8" strokeWidth={1.4} /> : <ToothGlyph className="h-8 w-8 opacity-60" />}
        </span>
      </div>

      <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-500 backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function BeforeAfterSlider({ item, className }: { item: BeforeAfterCase; className?: string }) {
  const [position, setPosition] = useState(52);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const element = containerRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(97, Math.max(3, next)));
  }, []);

  return (
    <div className={cn("overflow-hidden rounded-4xl border border-ink-100 bg-white shadow-soft", className)}>
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={`${item.treatment} before and after comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onPointerDown={(event) => {
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging) setFromClientX(event.clientX);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setPosition((value) => Math.max(3, value - 4));
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setPosition((value) => Math.min(97, value + 4));
          }
        }}
        className="relative aspect-[16/11] w-full cursor-ew-resize touch-none select-none sm:aspect-[16/9]"
      >
        <ComparisonPanel label="After" tone={item.tone} bright />

        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <ComparisonPanel label="Before" tone="ink" />
        </div>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 border-l border-dashed border-white/90" />
          <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-700 shadow-lift ring-1 ring-ink-100">
            <MoveHorizontal className="h-5 w-5" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-display text-[17px] text-ink-900">{item.treatment}</p>
          <p className="mt-0.5 text-[13px] text-ink-400">{item.duration}</p>
        </div>
        <p className="max-w-md text-[13.5px] leading-relaxed text-ink-500">{item.summary}</p>
      </div>
    </div>
  );
}
