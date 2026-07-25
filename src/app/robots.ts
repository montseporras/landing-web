import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

/**
 * robots.txt es PÚBLICO: a propósito NO listamos la ruta del panel acá, porque
 * hacerlo revelaría su URL secreta. El panel queda fuera de los buscadores por
 * otras vías: no está enlazado en ninguna página, no aparece en el sitemap,
 * el middleware redirige a los visitantes sin sesión y el layout del panel
 * envía `noindex`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
