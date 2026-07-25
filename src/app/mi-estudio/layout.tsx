import type { Metadata } from "next";

/**
 * Layout de la sección administrativa (ruta secreta). Solo aporta metadatos:
 * marca TODO el árbol —login incluido— como `noindex, nofollow` para que
 * ningún buscador lo registre aunque la URL llegara a filtrarse.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
