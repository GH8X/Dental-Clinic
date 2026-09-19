import { cva, type VariantProps } from "class-variance-authority";
import { Link, type LinkProps } from "react-router-dom";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ink-900 text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-lift",
        brand:
          "bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white shadow-glow hover:-translate-y-0.5 hover:brightness-[1.05]",
        secondary:
          "border border-ink-200/90 bg-white text-ink-800 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-mist hover:text-brand-700",
        soft: "bg-mist text-ink-700 hover:bg-mist-dark hover:text-ink-900",
        outlineBrand: "border border-brand-300 bg-white/60 text-brand-700 hover:bg-brand-50",
        whatsapp: "bg-[#25D366] text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1EB955]",
        danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
        ghost: "text-ink-500 hover:bg-mist hover:text-ink-900",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px] sm:h-14 sm:px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

interface ButtonLinkProps extends Omit<LinkProps, "className" | "children">, ButtonVariantProps {
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ className, variant, size, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}

interface ButtonAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement>, ButtonVariantProps {}

export function ButtonAnchor({ className, variant, size, ...props }: ButtonAnchorProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
