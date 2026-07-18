"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/ui/portrait";
import type { HeroContent } from "@/lib/types";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * Orden del contenido:
 * - Móvil (una columna, orden del DOM): título → foto → texto → CTAs → badges.
 * - Escritorio (grid 2×2): título y texto apilados a la izquierda, foto a la
 *   derecha ocupando ambas filas. Se logra con colocación explícita en `lg`.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-36">
      {/* Fondo: degradés orgánicos muy suaves */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-lavender-100/70 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-sand-100 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-gold-300/20 blur-3xl" />
      </div>

      <div className="container-content relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Título (col 1, fila 1) */}
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <motion.p
            {...fade(0.05)}
            className="eyebrow mb-6 flex items-center gap-2"
          >
            <Sparkles size={14} aria-hidden /> {content.eyebrow}
          </motion.p>

          <motion.h1
            {...fade(0.15)}
            className="text-display-lg text-balance text-ink lg:text-display-xl"
          >
            {content.title}{" "}
            <em className="font-light italic text-gold-600">
              {content.titleAccent}
            </em>
          </motion.h1>
        </div>

        {/* Retrato flotante (col 2, ambas filas) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-sm lg:self-center"
        >
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2.5rem] border border-gold-300/40"
          />
          <Portrait
            src={content.image}
            alt="Francis Salazar, coach de gestión emocional"
            className="aspect-[7/8] w-full shadow-lifted"
            priority
          />
          {/* Tarjeta flotante */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 left-2 max-w-[230px] rounded-3xl border border-sand-200 bg-white/90 px-5 py-4 shadow-soft backdrop-blur sm:-left-6 md:-left-12"
          >
            <p className="font-display text-lg text-ink">
              “La calma se entrena.”
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">
              Francis Salazar
            </p>
          </motion.div>
        </motion.div>

        {/* Texto + CTAs + badges (col 1, fila 2) */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <motion.p
            {...fade(0.3)}
            className="text-justify-soft max-w-xl text-lg leading-relaxed text-muted"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            {...fade(0.45)}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button href={content.primaryCta.href} variant="lila" size="lg">
              {content.primaryCta.label}
            </Button>
            <Button
              href={content.secondaryCta.href}
              variant="secondary"
              size="lg"
            >
              {content.secondaryCta.label}
            </Button>
          </motion.div>

          <motion.ul
            {...fade(0.6)}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {content.badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-gold-500"
                />
                {badge}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <motion.a
        href="#beneficios"
        aria-label="Bajar a la siguiente sección"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-ink md:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="block"
        >
          <ArrowDown size={20} />
        </motion.span>
      </motion.a>
    </section>
  );
}
