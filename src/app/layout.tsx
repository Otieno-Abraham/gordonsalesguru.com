import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Analytics from "@/components/Analytics";
import { siteConfig, assetPath } from "@/lib/config";
import { pageTitle } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: pageTitle("Premium Kitchens, Wardrobes & Interiors"),
    template: "%s",
  },
  description:
    "Gordon Odhiambo — your personal interior solutions expert. Premium custom kitchen cabinets, wardrobes, bathrooms and full interior fitouts, delivered across East Africa.",
  applicationName: "Gordon Sales Guru",
  authors: [{ name: siteConfig.person.name }],
  creator: siteConfig.person.name,
  icons: {
    icon: assetPath("/favicon.ico"),
    apple: assetPath("/icon.png"),
  },
  alternates: {
    canonical: siteConfig.siteUrl + "/",
    languages: { "en-KE": siteConfig.siteUrl + "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Gordon Sales Guru",
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#042C53",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <WhatsAppWidget />
        <Analytics />
      </body>
    </html>
  );
}
