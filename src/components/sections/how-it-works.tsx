"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

interface Step {
  step: string;
  title: string;
  description: string;
}

/**
 * Línea de tiempo "Camino Claro, Paso a Paso".
 *
 * Layout a prueba de superposiciones:
 * - Móvil: una sola columna con la línea y los nodos a la izquierda.
 * - Desktop (md+): grid de 3 columnas [contenido | nodo | contenido]; el nodo
 *   vive SIEMPRE en la columna central, por lo que el texto nunca puede
 *   quedar debajo de él, en ningún ancho de pantalla.
 */
export function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Cómo trabajamos</p>
          <h2 className="text-display-lg text-balance text-ink">
            Camino Claro,{" "}
            <em className="font-light italic text-gold-600">Paso a Paso</em>
          </h2>
          <p className="prose-fs mt-5">
            Un proceso simple y transparente, diseñado para que sepas
            exactamente qué esperar en cada etapa.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl md:mt-20">
          {/* Línea vertical: a la izquierda en móvil, centrada en desktop */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute bottom-5 top-5 left-[1.375rem] w-px origin-top bg-gradient-to-b from-gold-400 via-sand-300 to-lavender-300 md:left-1/2 md:-translate-x-px"
          />

          <ol className="space-y-10 md:space-y-16">
            {steps.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={item.step}>
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex items-start gap-5 md:grid md:grid-cols-[1fr_4.5rem_1fr] md:items-center md:gap-0"
                  >
                    {/* Nodo numerado — columna central propia en desktop */}
                    <span className="z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-gold-400 bg-cream font-display text-sm font-semibold text-gold-600 shadow-soft md:order-2 md:col-start-2 md:mx-auto md:h-12 md:w-12">
                      {item.step}
                    </span>

                    {/* Contenido — alterna de lado en desktop, nunca pisa el nodo */}
                    <div
                      className={
                        isLeft
                          ? "md:order-1 md:col-start-1 md:text-right"
                          : "md:order-3 md:col-start-3 md:text-left"
                      }
                    >
                      <div className="rounded-3xl border border-sand-200 bg-white/70 p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-gold-300 hover:shadow-lifted md:p-7">
                        <h3 className="font-display text-xl text-ink md:text-2xl">
                          {item.title}
                        </h3>
                        <p className="text-justify-soft mt-2 text-sm leading-relaxed text-muted md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Columna vacía del lado opuesto (solo desktop) */}
                    <div
                      aria-hidden
                      className={
                        isLeft
                          ? "hidden md:block md:order-3 md:col-start-3"
                          : "hidden md:block md:order-1 md:col-start-1"
                      }
                    />
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
