import { Link } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { cn } from "@/lib/utils";

export function ToothGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3.5c-2.6 0-4 1.2-6.2 1.2C7.6 4.7 5.6 6.7 5.6 10.5c0 3.2 1 5.3 2.1 7.6.9 1.7 1.2 3.9 1.5 5.9.2 1.6.5 2.8 1.8 2.8 1.3 0 1.6-1.3 1.8-3.1.3-1.8.6-4 3.2-4s2.9 2.2 3.2 4c.2 1.8.5 3.1 1.8 3.1 1.3 0 1.6-1.2 1.8-2.8.3-2 .6-4.2 1.5-5.9 1.1-2.3 2.1-4.4 2.1-7.6 0-3.8-2-5.8-4.2-5.8-2.2 0-3.6-1.2-6.2-1.2Z" />
    </svg>
  );
}

interface BrandMarkProps {
  variant?: "dark" | "light";
  className?: string;
  withLink?: boolean;
}

export function BrandMark({ variant = "dark", className, withLink = true }: BrandMarkProps) {
  const { content } = useData();
  const [firstWord, ...rest] = content.brand.name.split(" ");
  const secondWord = rest.join(" ") || "Clinic";
  const light = variant === "light";

  const inner = (
    <span className="flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow">
        <ToothGlyph className="h-5 w-5" />
        <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] tracking-tight", light ? "text-white" : "text-ink-900")}>
          {firstWord}
        </span>
        <span
          className={cn(
            "mt-1 text-[9.5px] font-semibold uppercase tracking-[0.3em]",
            light ? "text-brand-200" : "text-brand-600",
          )}
        >
          {secondWord}
        </span>
      </span>
    </span>
  );

  if (!withLink) {
    return <span className={cn("inline-flex", className)}>{inner}</span>;
  }

  return (
    <Link to="/" aria-label={`${content.brand.name} home`} className={cn("group inline-flex", className)}>
      {inner}
    </Link>
  );
}
