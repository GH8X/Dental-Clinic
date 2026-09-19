import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}

export function Stars({ rating, className, size = "sm" }: StarsProps) {
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            dimension,
            value <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-ink-100 text-ink-100",
          )}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}
