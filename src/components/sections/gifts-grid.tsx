"use client";

import { Gift as GiftIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { GiftAccessAction } from "@/components/sections/gift-access";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/ui/icon";
import { giftCategoryDisplay } from "@/lib/content/defaults";
import { cn } from "@/lib/utils";
import type { Gift } from "@/lib/types";

/**
 * NOTA DE DISEÑO: este listado NO usa animaciones disparadas por scroll
 * (whileInView). Con ellas, al volver atrás desde un recurso el navegador
 * restauraba el scroll y las tarjetas podían quedar invisibles. Acá las
 * tarjetas se renderizan siempre visibles; la elegancia la aportan las
 * transiciones de hover, que no dependen del estado de la página.
 */

const categoryIcon: Record<string, string> = {
  ebook: "BookOpen",
  guia: "BookOpen",
  plantilla: "LayoutTemplate",
  checklist: "CheckSquare",
  meditacion: "Wind",
  audio: "Headphones",
  video: "PlayCircle",
  curso: "Lightbulb",
  pdf: "FileText",
};

function iconFor(category: string): string {
  return categoryIcon[category.trim().toLowerCase()] ?? "Sparkles";
}

/** Tarjeta individual de regalo con su modo de acceso configurado. */
function GiftCard({ gift }: { gift: Gift }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-sand-200 bg-white/70 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-lifted">
      {/* Portada */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-lavender-100 via-sand-50 to-sand-100">
        {gift.image ? (
          <Image
            src={gift.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/70 text-gold-600 shadow-soft transition-transform duration-700 group-hover:scale-110">
              <DynamicIcon name={iconFor(gift.category)} size={28} />
            </span>
          </div>
        )}
        <Badge
          tone="gold"
          className="absolute left-4 top-4 bg-white/90 backdrop-blur"
        >
          {giftCategoryDisplay(gift.category)}
        </Badge>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-xl leading-snug text-ink">
          {gift.title}
        </h3>
        <p className="text-justify-soft mt-2 flex-1 text-sm leading-relaxed text-muted">
          {gift.description}
        </p>
        <div className="mt-6">
          <GiftAccessAction gift={gift} />
        </div>
      </div>
    </article>
  );
}

/** Grid de regalos con filtros por tipo (tipos libres, derivados del contenido). */
export function GiftsGrid({
  gifts,
  showFilters = true,
}: {
  gifts: Gift[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState("todos");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(gifts.map((g) => g.category.trim().toLowerCase())),
    );
    return ["todos", ...unique];
  }, [gifts]);

  const filtered =
    filter === "todos"
      ? gifts
      : gifts.filter((g) => g.category.trim().toLowerCase() === filter);

  return (
    <div>
      {showFilters && categories.length > 2 && (
        <div
          role="tablist"
          aria-label="Filtrar regalos por tipo"
          className="mb-10 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              type="button"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500",
                filter === cat
                  ? "border-lavender-600 bg-lavender-600 text-white"
                  : "border-sand-200 bg-white/60 text-muted hover:border-lavender-400 hover:text-ink",
              )}
            >
              {cat === "todos" ? "Todos" : giftCategoryDisplay(cat)}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      ) : (
        <p className="flex items-center justify-center gap-2 rounded-3xl bg-sand-50 p-12 text-center text-muted">
          <GiftIcon size={18} aria-hidden /> Pronto habrá nuevos regalos en esta
          categoría.
        </p>
      )}
    </div>
  );
}
