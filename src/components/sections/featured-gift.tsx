"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";
import { GiftAccessAction } from "@/components/sections/gift-access";
import { Reveal } from "@/components/motion/reveal";
import { giftCategoryDisplay } from "@/lib/content/defaults";
import type { Gift } from "@/lib/types";

/**
 * Regalo destacado en la portada (típicamente el eBook principal).
 * Diseño editorial horizontal: portada a un lado, texto y acceso al otro.
 * El mismo recurso sigue apareciendo, además, en la grilla de /regalos
 * (src/components/sections/gifts-grid.tsx), que se mantiene sin animaciones
 * a propósito — este componente es el único con el tratamiento "llamativo".
 */
export function FeaturedGift({ gift }: { gift: Gift }) {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="container-content">
        <Reveal>
          <div className="group relative grid items-center gap-8 overflow-hidden rounded-4xl border border-sand-200 bg-gradient-to-br from-white via-lavender-50 to-sand-50 p-6 shadow-soft transition-shadow duration-500 hover:shadow-lifted md:gap-12 md:p-10 lg:grid-cols-2 lg:p-14">
            {/* Halos decorativos */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl"
            />

            {/* Portada del eBook */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto w-full max-w-[18rem] lg:max-w-xs"
            >
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[2rem] border border-gold-300/40 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 to-sand-100 shadow-lifted transition-transform duration-500 group-hover:scale-105">
                {gift.image ? (
                  <Image
                    src={gift.image}
                    alt={`Portada de ${gift.title}`}
                    fill
                    sizes="(max-width: 1024px) 18rem, 20rem"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <motion.div
                      animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <BookOpen
                        size={64}
                        className="text-gold-500/70"
                        aria-hidden
                      />
                    </motion.div>
                  </div>
                )}
              </div>
              {/* Chispa decorativa */}
              <motion.span
                aria-hidden
                animate={
                  reduce
                    ? undefined
                    : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft"
              >
                <Sparkles size={18} className="text-gold-500" aria-hidden />
              </motion.span>
            </motion.div>

            {/* Contenido */}
            <div>
              <p className="eyebrow mb-4 flex items-center gap-2">
                <Sparkles size={14} aria-hidden /> Regalo destacado ·{" "}
                {giftCategoryDisplay(gift.category)}
              </p>
              <h2 className="text-display-md text-balance text-ink">
                {gift.title}
              </h2>
              <p className="prose-fs mt-5">{gift.description}</p>
              <div className="mt-8 max-w-sm">
                <GiftAccessAction gift={gift} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
