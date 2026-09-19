import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "white" | "mist" | "ink";
type SectionSize = "sm" | "md" | "lg";

const TONES: Record<SectionTone, string> = {
  white: "bg-white",
  mist: "bg-mist",
  ink: "bg-ink-900 text-white",
};

const SIZES: Record<SectionSize, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  size?: SectionSize;
  bleed?: boolean;
  children: ReactNode;
}

export function Section({ tone = "white", size = "md", bleed = false, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("relative", TONES[tone], SIZES[size], className)} {...props}>
      {bleed ? children : <div className="container">{children}</div>}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  className,
  action,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "items-start lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center")}>
        {eyebrow ? (
          <p className={cn("eyebrow mb-4", invert && "text-brand-300")}>
            <span className={cn("h-px w-6", invert ? "bg-brand-300/70" : "bg-brand-400/70")} />
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("text-balance", invert && "text-white")}>{title}</h2>
        {description ? (
          <p className={cn("mt-5 text-pretty text-[15px] leading-relaxed sm:text-base", invert ? "text-ink-100/80" : "text-ink-500")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
