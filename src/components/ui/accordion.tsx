import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { FaqItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AccordionProps {
  items: FaqItem[];
  className?: string;
  defaultOpenId?: string | null;
}

export function Accordion({ items, className, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  if (items.length === 0) {
    return <p className="text-sm text-ink-400">No questions published yet.</p>;
  }

  return (
    <div className={cn("divide-y divide-ink-100 overflow-hidden rounded-4xl border border-ink-100 bg-white", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-mist/70"
            >
              <span className={cn("font-display text-[16.5px] leading-snug", open ? "text-brand-700" : "text-ink-900")}>
                {item.question}
              </span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
                  open ? "border-brand-200 bg-brand-50 text-brand-600" : "border-ink-200 text-ink-400",
                )}
              >
                {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 pr-14 text-[15px] leading-relaxed text-ink-500">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
