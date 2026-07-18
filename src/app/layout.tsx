import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getSeo, getGeneral } from "@/lib/content/queries";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [seo, general] = await Promise.all([getSeo(), getGeneral()]);
  const url = siteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: seo.metaTitle,
      template: `%s · ${general.brandName} — ${general.coachName}`,
    },
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url,
      siteName: `${general.brandName} — ${general.coachName}`,
      title: seo.metaTitle,
      description: seo.metaDescription,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
