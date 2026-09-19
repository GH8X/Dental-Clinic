import { ArrowUpRight, Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "@/lib/api";
import { euro } from "@/lib/utils";
import { CardInteractive } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  return (
    <CardInteractive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-100">
          <Icon name={service.icon} className="h-[22px] w-[22px]" />
        </span>
        <span className="text-right">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">from</span>
          <span className="font-display text-lg text-ink-900">{euro(service.priceFrom)}</span>
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl text-ink-900">{service.name}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{service.tagline}</p>

      {!compact ? (
        <ul className="mt-5 space-y-2">
          {service.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5 text-[13.5px] text-ink-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2} />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-400">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
          {service.duration}
        </span>
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1 text-[13.5px] font-medium text-brand-700 transition-colors hover:text-brand-800"
        >
          Details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </CardInteractive>
  );
}
