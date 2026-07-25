"use client";

import { Gift, HelpCircle, Inbox, MailWarning, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminCard, AdminHeader, NotConfigured } from "@/components/admin/ui";
import { adminCount } from "@/lib/admin/actions";
import { ADMIN_BASE_PATH } from "@/lib/admin/config";

interface Stats {
  regalos: number;
  faqs: number;
  contactos: number;
  llamadas: number;
  nuevos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    async function load() {
      const count = async (table: string, filter?: [string, string]) => {
        const { data, error } = await adminCount(table, filter);
        if (error === "not_configured") setConfigured(false);
        return data ?? 0;
      };
      const [regalos, faqs, contactos, llamadas, nuevos] = await Promise.all([
        count("gifts"),
        count("faqs"),
        count("submissions", ["type", "contacto"]),
        count("submissions", ["type", "llamada"]),
        count("submissions", ["status", "nuevo"]),
      ]);
      setStats({ regalos, faqs, contactos, llamadas, nuevos });
    }
    load();
  }, []);

  const cards = [
    {
      label: "Mensajes sin leer",
      value: stats?.nuevos,
      icon: MailWarning,
      href: `${ADMIN_BASE_PATH}/formularios`,
    },
    {
      label: "Regalos publicados",
      value: stats?.regalos,
      icon: Gift,
      href: `${ADMIN_BASE_PATH}/regalos`,
    },
    {
      label: "Preguntas frecuentes",
      value: stats?.faqs,
      icon: HelpCircle,
      href: `${ADMIN_BASE_PATH}/faq`,
    },
    {
      label: "Mensajes de contacto",
      value: stats?.contactos,
      icon: Inbox,
      href: `${ADMIN_BASE_PATH}/formularios`,
    },
    {
      label: "Solicitudes de llamada",
      value: stats?.llamadas,
      icon: PhoneCall,
      href: `${ADMIN_BASE_PATH}/formularios`,
    },
  ];

  return (
    <>
      <AdminHeader
        title="Panel de administración"
        description="Desde acá gestionás todo el contenido del sitio, sin tocar código."
      />

      {!configured && <NotConfigured />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <AdminCard className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lifted">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-100 text-lavender-500">
                  <card.icon size={18} aria-hidden />
                </span>
                <span className="font-display text-3xl text-ink">
                  {card.value ?? "—"}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">{card.label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <AdminCard className="mt-8" title="Accesos rápidos">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`${ADMIN_BASE_PATH}/regalos`}
            className="rounded-full bg-lavender-600 px-5 py-2.5 text-sm text-cream transition-colors hover:bg-lavender-700"
          >
            + Subir un regalo
          </Link>
          <Link
            href={`${ADMIN_BASE_PATH}/inicio`}
            className="rounded-full border border-sand-300 px-5 py-2.5 text-sm text-ink transition-colors hover:border-lavender-400"
          >
            Editar página de inicio
          </Link>
          <Link
            href={`${ADMIN_BASE_PATH}/formularios`}
            className="rounded-full border border-sand-300 px-5 py-2.5 text-sm text-ink transition-colors hover:border-lavender-400"
          >
            Ver mensajes recibidos
          </Link>
        </div>
      </AdminCard>

      <AdminCard className="mt-6" title="¿Cómo funciona?">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
          <li>Todo lo que guardes acá se publica en el sitio al instante.</li>
          <li>
            Las fotos y archivos se suben con el botón «Subir» de cada sección.
          </li>
          <li>
            Podés ocultar cualquier regalo o pregunta sin borrarla, con el
            interruptor verde.
          </li>
        </ul>
      </AdminCard>
    </>
  );
}
