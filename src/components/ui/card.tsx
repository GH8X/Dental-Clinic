import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-4xl border border-ink-100/80 bg-white p-6 shadow-soft transition-all duration-300 sm:p-7",
        className,
      )}
      {...props}
    />
  );
}

export function CardInteractive({ className, ...props }: DivProps) {
  return (
    <Card
      className={cn(
        "group hover:-translate-y-1 hover:border-brand-200 hover:shadow-card focus-within:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("mb-4 flex items-start justify-between gap-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg text-ink-900 sm:text-xl", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed text-ink-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("mt-5 flex items-center justify-between gap-3", className)} {...props} />;
}
