/**
 * Central site configuration.
 *
 * Everything here is driven by NEXT_PUBLIC_* environment variables with safe
 * defaults so the site builds and renders even before the client fills in
 * their real WhatsApp number, Formspree ID, analytics IDs, etc.
 */

const env = (key: string, fallback = ""): string => {
  const v = process.env[key];
  return v && v.length > 0 ? v : fallback;
};

export const siteConfig = {
  // Brand / person
  brandName: "GordonSalesGuru",
  person: {
    name: "Gordon Odhiambo",
    title: "Sales Executive",
    tagline: "Your Interior Solutions Expert",
    jobTitle: "Sales Executive — Interior Solutions",
  },

  // Contact
  email: env("NEXT_PUBLIC_EMAIL", "consult@gordonsalesguru.com"),
  whatsappNumber: env("NEXT_PUBLIC_WHATSAPP_NUMBER", "254743831795"),
  calendlyUrl: env("NEXT_PUBLIC_CALENDLY_URL", "https://calendly.com/gordonsalesguru"),

  // Location
  showroom: {
    name: "Aryan Centre Showroom",
    line1: "Aryan Centre, Block 14",
    line2: "Behind Subaru Kenya, Mombasa Road",
    city: "Nairobi",
    region: "Nairobi",
    country: "Kenya",
    full: "Aryan Centre, Block 14, behind Subaru Kenya, Mombasa Road, Nairobi, Kenya",
    // Keyless Google Maps embed (maps.google.com form renders reliably inside an
    // iframe; the www.google.com/maps form is frequently blank).
    mapEmbed:
      "https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=Aryan%20Centre%20Mombasa%20Road%20Nairobi&t=&z=15&ie=UTF8&iwloc=B&output=embed",
    mapLink: "https://www.google.com/maps?q=Aryan+Centre+Mombasa+Road+Nairobi",
    geo: { lat: -1.319167, lng: 36.851111 },
  },

  hours: {
    weekdays: "Mon–Fri: 8am – 5pm",
    saturday: "Sat: 10am – 4pm",
    sunday: "Sun: Closed",
    note: "I respond within 2 hours during business hours.",
    schema: ["Mo-Fr 08:00-17:00", "Sa 10:00-16:00"],
  },

  // Geographic focus
  geo: {
    primary: "Kenya",
    countries: ["Kenya", "Uganda", "Tanzania", "Rwanda"],
    region: "East Africa",
    locale: "en_KE",
    hreflang: "en-KE",
  },

  // Credibility stats (placeholders — easy for the client to update)
  stats: [
    { label: "Projects Completed", value: "500+" },
    { label: "Years Experience", value: "8+" },
    { label: "Countries Served", value: "4" },
    { label: "Satisfaction Rate", value: "98%" },
  ],

  // URLs / deployment
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "https://gordonsalesguru.com").replace(/\/$/, ""),
  basePath: env("NEXT_PUBLIC_BASE_PATH", ""),

  // Integrations
  formspreeId: env("NEXT_PUBLIC_FORMSPREE_ID", "xrevrldg"),
  gaMeasurementId: env("NEXT_PUBLIC_GA_MEASUREMENT_ID", ""),
  facebookPixelId: env("NEXT_PUBLIC_FACEBOOK_PIXEL_ID", ""),
};

export type ProductCategoryKey = "kitchens" | "wardrobes" | "bathrooms" | "fitouts";

export const productCategories: {
  key: ProductCategoryKey;
  name: string;
  shortName: string;
  blurb: string;
  href: string;
}[] = [
  {
    key: "kitchens",
    name: "Kitchen Cabinets",
    shortName: "Kitchens",
    blurb: "Custom-built kitchen cabinets engineered to fit your space and lifestyle.",
    href: "/products/?category=kitchens",
  },
  {
    key: "wardrobes",
    name: "Wardrobes",
    shortName: "Wardrobes",
    blurb: "Fitted walk-in and built-in wardrobes that make the most of every room.",
    href: "/products/?category=wardrobes",
  },
  {
    key: "bathrooms",
    name: "Bathrooms",
    shortName: "Bathrooms",
    blurb: "Elegant bathroom vanities and storage designed for everyday luxury.",
    href: "/products/?category=bathrooms",
  },
  {
    key: "fitouts",
    name: "Interior Fitouts",
    shortName: "Fitouts",
    blurb: "Complete interior fitouts for homes, offices and developments.",
    href: "/products/?category=fitouts",
  },
];

// Prefix an absolute static asset path with the configured basePath.
// next/image and next/link handle basePath automatically; use this only for
// raw asset references such as <video src> or <link href>.
export function assetPath(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.basePath}${path}`;
}

// Build a wa.me link with an optional pre-filled message.
export function whatsappLink(message?: string): string {
  const number = siteConfig.whatsappNumber;
  const text = message ?? defaultWhatsappMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const defaultWhatsappMessage =
  "Hi Gordon, I found your website and I'm interested in your interior solutions. Can we talk?";

export const whatsappMessages = {
  default: defaultWhatsappMessage,
  product: (name: string) =>
    `Hi Gordon, I'm interested in the ${name} I saw on your website. Can you tell me more?`,
  project: (name: string) =>
    `Hi Gordon, I love the ${name} project on your website. I'd like something similar for my space.`,
  consultation:
    "Hi Gordon, I'd like to book a free consultation about my interior project. When are you available?",
  blog: (title: string) =>
    `Hi Gordon, I just read your article "${title}" and I'd like to discuss my project.`,
};

export const navLinks = [
  { label: "Products", href: "/products/" },
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
