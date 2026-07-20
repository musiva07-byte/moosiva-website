import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosivabh.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moosiva Lux Wear | Premium Ladies' Wear in Bahrain",
    template: "%s | Moosiva Lux Wear",
  },
  description:
    "Moosiva Lux Wear is a premium ladies' boutique in Bahrain. Browse the collection and request your favorites on WhatsApp.",
  openGraph: {
    title: "Moosiva Lux Wear",
    description:
      "Premium ladies' wear in Bahrain. Browse the collection and order on WhatsApp.",
    url: siteUrl,
    siteName: "Moosiva Lux Wear",
    locale: "en_BH",
    type: "website",
    images: [{ url: "/moosiva-lux-wear-logo.jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-page font-sans text-ink antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
