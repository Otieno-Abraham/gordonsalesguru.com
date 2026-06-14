/**
 * seo.ts — metadata + structured data helpers.
 *
 * Centralises every page's <title>, meta description, Open Graph / Twitter tags,
 * canonical URL and hreflang, plus the five JSON-LD schemas the site ships:
 * Person, LocalBusiness, Article, BreadcrumbList and FAQPage.
 */

import type { Metadata } from "next";
import { siteConfig } from "./config";

const DEFAULT_OG_IMAGE = "/og-image.jpg";

/** Absolute URL for a site-relative path (handles basePath + trailing slash). */
export function absoluteUrl(pathname = "/"): string {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const bp = siteConfig.basePath || "";
  let p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // normalise to a trailing slash for non-file paths
  if (!/\.[a-z0-9]+$/i.test(p) && !p.endsWith("/")) p = `${p}/`;
  return `${base}${bp}${p}`;
}

export function pageTitle(topic: string): string {
  return `Gordon Odhiambo | ${topic} | Interior Solutions Expert | East Africa`;
}

interface BuildMetaArgs {
  title: string; // the full <title> (use pageTitle() to format)
  description: string;
  path: string; // site-relative path, e.g. "/products"
  image?: string; // site-relative or absolute
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  keywords,
}: BuildMetaArgs): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    keywords: keywords && keywords.length ? keywords : undefined,
    alternates: {
      canonical: url,
      languages: { "en-KE": url },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Gordon Sales Guru",
      type,
      locale: "en_KE",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/* ----------------------------- JSON-LD schemas ---------------------------- */

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.person.name,
    jobTitle: siteConfig.person.jobTitle,
    description:
      "Sales Executive specialising in premium custom kitchen cabinets, wardrobes, bathrooms and full interior fitouts across East Africa.",
    url: absoluteUrl("/"),
    image: absoluteUrl("/media/images/gordon/gordon.webp"),
    email: `mailto:${siteConfig.email}`,
    telephone: `+${siteConfig.whatsappNumber}`,
    knowsAbout: [
      "Kitchen cabinets",
      "Custom kitchens",
      "Fitted wardrobes",
      "Bathroom vanities",
      "Interior fitouts",
      "Interior design",
    ],
    areaServed: siteConfig.geo.countries,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.showroom.line1}, ${siteConfig.showroom.line2}`,
      addressLocality: siteConfig.showroom.city,
      addressRegion: siteConfig.showroom.region,
      addressCountry: "KE",
    },
    sameAs: [],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${absoluteUrl("/")}#business`,
    name: "Gordon Sales Guru — Interior Solutions",
    description:
      "Premium custom kitchen cabinets, fitted wardrobes, bathroom vanities and full interior fitouts, delivered across East Africa by Gordon Odhiambo.",
    url: absoluteUrl("/"),
    image: absoluteUrl("/og-image.jpg"),
    email: `mailto:${siteConfig.email}`,
    telephone: `+${siteConfig.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.showroom.line1}, ${siteConfig.showroom.line2}`,
      addressLocality: siteConfig.showroom.city,
      addressRegion: siteConfig.showroom.region,
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.showroom.geo.lat,
      longitude: siteConfig.showroom.geo.lng,
    },
    areaServed: siteConfig.geo.countries.map((name) => ({
      "@type": "Country",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    founder: { "@type": "Person", name: siteConfig.person.name },
  };
}

export function articleSchema(args: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  keywords?: string[];
}) {
  const image = args.image.startsWith("http")
    ? args.image
    : absoluteUrl(args.image);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    image: [image],
    datePublished: args.datePublished,
    dateModified: args.datePublished,
    author: {
      "@type": "Person",
      name: siteConfig.person.name,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: "Gordon Sales Guru",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/og-image.jpg"),
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(args.path) },
    keywords: (args.keywords ?? []).join(", "),
    inLanguage: "en-KE",
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Auto-generate breadcrumbs from a site-relative path. */
export function breadcrumbsFromPath(
  pathname: string,
  labels: Record<string, string> = {}
) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", path: "/" }];
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    const label =
      labels[part] ??
      part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    crumbs.push({ name: label, path: acc });
  }
  return crumbs;
}
