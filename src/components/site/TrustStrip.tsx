import { BadgeCheck } from "lucide-react";
import { TONE_CLASSES, type StatItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/ui/reveal";

interface TrustStripProps {
  items: string[];
  className?: string;
}

export function TrustStrip({ items, className }: TrustStripProps) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-7 gap-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <BadgeCheck className="h-4 w-4 text-brand-500" strokeWidth={1.8} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StatRow({ stats, invert = false }: { stats: StatItem[]; invert?: boolean }) {
  return (
    <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <RevealItem
          key={stat.id}
          className={cn(
            "rounded-4xl border p-6",
            invert ? "border-white/10 bg-white/[0.06]" : TONE_CLASSES.teal.panel + " border-ink-100/80 bg-gradient-to-br",
          )}
        >
          <p className={cn("font-display text-3xl sm:text-4xl", invert ? "text-white" : "text-ink-900")}>{stat.value}</p>
          <p className={cn("mt-2 text-[13.5px] leading-snug", invert ? "text-ink-100/70" : "text-ink-500")}>
            {stat.label}
          </p>
          <span
            className={cn(
              "mt-4 block h-px w-10",
              invert ? "bg-brand-300/60" : index % 2 === 0 ? "bg-brand-400/60" : "bg-accent-400/60",
            )}
          />
        </RevealItem>
      ))}
    </Reveal>
  );
}
