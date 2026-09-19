import { ArrowLeft, CalendarCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";

interface NotFoundBodyProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function NotFoundBody({ title, description, children }: NotFoundBodyProps) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      </div>

      <div className="container relative py-24 text-center sm:py-32">
        <p className="eyebrow justify-center">Not found</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl text-ink-900 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-500">{description}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {children ?? (
            <>
              <ButtonLink to="/services" variant="primary" size="lg">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
                All treatments
              </ButtonLink>
              <ButtonLink to="/appointment" variant="brand" size="lg">
                <CalendarCheck className="h-4 w-4" strokeWidth={1.9} />
                Book an appointment
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
