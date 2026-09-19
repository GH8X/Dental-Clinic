import type { ReactNode } from "react";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/field";

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-4xl border border-ink-100 bg-white shadow-soft", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="font-display text-lg text-ink-900">{title}</h2>
            {description ? <p className="mt-0.5 text-[13px] text-ink-400">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: "brand" | "amber" | "blue" | "ink";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-accent-50 text-accent-600",
    ink: "bg-ink-50 text-ink-600",
  } as const;

  return (
    <div className="rounded-4xl border border-ink-100 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</p>
        <span className={cn("grid h-10 w-10 place-items-center rounded-2xl", tones[tone])}>{icon}</span>
      </div>
      <p className="mt-4 font-display text-3xl text-ink-900">{value}</p>
      {hint ? <p className="mt-1.5 text-[12.5px] text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-mist/60 px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink-400 shadow-soft">
        <TriangleAlert className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <p className="mt-4 font-display text-[16px] text-ink-900">{title}</p>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-ink-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 pl-11 text-[14px]"
      />
    </div>
  );
}

export function SavingIndicator({ saving }: { saving: boolean }) {
  if (!saving) return null;
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-ink-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      Saving…
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 text-[13.5px] font-medium text-ink-600"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-200",
          checked ? "bg-brand-500" : "bg-ink-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-all duration-200",
            checked ? "left-[1.4rem]" : "left-0.5",
          )}
        />
      </span>
      {label}
    </button>
  );
}
