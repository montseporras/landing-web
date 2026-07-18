import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sobre-mi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/servicios`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/regalos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacto`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
