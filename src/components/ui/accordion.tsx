"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { RichTextView } from "@/components/ui/rich-text";
import type { Align } from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  /** Requerido a propósito (no `?:`): así un futuro caller que se olvide de
   * pasarlo da un error de tipos en vez de perder la alineación en
   * silencio con un `?? "left"`. */
  answerAlign: Align;
}

/** Acordeón animado y accesible para las preguntas frecuentes. */
export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div
      className={cn(
        "divide-y divide-sand-200 rounded-3xl border border-sand-200 bg-white/70 backdrop-blur",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="px-6 md:px-8">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg text-ink md:text-xl">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sand-200 text-gold-600"
              >
                <Plus size={16} aria-hidden />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <RichTextView
                    html={item.answer}
                    align={item.answerAlign}
                    className="pb-6 pr-10 leading-relaxed text-muted"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
