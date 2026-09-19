import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  className?: string;
}

export function PageHero({ eyebrow, title, description, crumbs, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-ink-100 bg-mist", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-200/35 blur-3xl" />
        <div className="absolute -left-20 bottom-[-6rem] h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
        <div
          className="absolute inset-0 bg-grid-soft opacity-[0.35]"
          style={{ backgroundSize: "56px 56px" }}
        />
      </div>

      <div className="container relative py-14 sm:py-20 lg:py-24">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[12.5px] text-ink-400">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-brand-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink-600">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
              </span>
            ))}
          </nav>
        ) : null}

        <p className="eyebrow mb-4">
          <span className="h-px w-6 bg-brand-400/70" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance">{title}</h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-pretty text-[16px] leading-relaxed text-ink-500">{description}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
