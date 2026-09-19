import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/api";
import { formatMonthYear, initials } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-4xl border border-ink-100/80 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
      <div className="flex items-center justify-between">
        <Stars rating={testimonial.rating} size="md" />
        <Quote className="h-7 w-7 text-brand-100" strokeWidth={1.5} />
      </div>

      <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-600">“{testimonial.quote}”</blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 font-display text-sm text-brand-700">
          {initials(testimonial.patientName)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-medium text-ink-900">{testimonial.patientName}</span>
          <span className="block truncate text-[12.5px] text-ink-400">
            {testimonial.service} · {testimonial.city} · {formatMonthYear(testimonial.date)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
