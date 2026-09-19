import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import type { AppointmentStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        brand: "bg-brand-50 text-brand-700",
        blue: "bg-accent-50 text-accent-700",
        neutral: "bg-ink-50 text-ink-600",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-600",
        outline: "border border-ink-200 bg-white text-ink-500",
      },
    },
    defaultVariants: { variant: "brand" },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

const STATUS_VARIANTS: Record<AppointmentStatus, BadgeProps["variant"]> = {
  pending: "warning",
  confirmed: "brand",
  completed: "success",
  cancelled: "danger",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>;
}
