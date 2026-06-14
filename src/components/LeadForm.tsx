"use client";

import { useState, type FormEvent } from "react";
import { siteConfig, whatsappLink } from "@/lib/config";
import { WhatsAppIcon, Check } from "./Icons";

const PRODUCT_OPTIONS = [
  "Kitchen Cabinets",
  "Wardrobes",
  "Bathrooms",
  "Full Interior Fitout",
  "Not sure yet",
];

type Status = "idle" | "submitting" | "success" | "error";

interface LeadFormProps {
  /** A short heading shown above the form. Pass null to hide it. */
  heading?: string | null;
  subheading?: string;
  /** Compact mode tightens spacing for use inside modals. */
  compact?: boolean;
  id?: string;
}

export default function LeadForm({
  heading = "Request a Free Consultation",
  subheading = "Tell Gordon about your space. He responds within 2 hours during business hours.",
  compact = false,
  id,
}: LeadFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [waHref, setWaHref] = useState<string>(whatsappLink());

  const formspreeReady =
    siteConfig.formspreeId && siteConfig.formspreeId !== "your_formspree_id";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot — bots fill this, humans don't
    if ((data.get("_gotcha") as string)?.length) return;

    const name = (data.get("name") as string) || "";
    const phone = (data.get("phone") as string) || "";
    const email = (data.get("email") as string) || "";
    const interest = (data.get("interest") as string) || "";
    const location = (data.get("location") as string) || "";
    const details = (data.get("details") as string) || "";

    // Build the WhatsApp alert message so Gordon is notified on his phone.
    const waMessage =
      `New website enquiry%0A` +
      `Name: ${name}%0A` +
      `Phone: ${phone}%0A` +
      `Email: ${email}%0A` +
      `Interest: ${interest}%0A` +
      `Location: ${location}%0A` +
      `Details: ${details}`;
    const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${waMessage}`;
    setWaHref(href);

    setStatus("submitting");

    if (!formspreeReady) {
      // No Formspree ID yet — fall straight through to the WhatsApp alert.
      setStatus("success");
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${siteConfig.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        // alert Gordon on WhatsApp
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        id={id}
        className="rounded-card bg-sky p-8 text-center ring-1 ring-accent/20"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-whatsapp text-white">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-navy">
          Thank you! Gordon will contact you within 2 hours.
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          Want to skip the wait? Message Gordon directly and he&apos;ll get
          straight back to you.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-5"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Message Gordon on WhatsApp
        </a>
      </div>
    );
  }

  const gap = compact ? "gap-3" : "gap-4";

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`flex flex-col ${gap}`}
      noValidate
    >
      {heading && (
        <div className={compact ? "mb-1" : "mb-2"}>
          <h3 className="text-xl font-semibold text-navy sm:text-2xl">{heading}</h3>
          {subheading && <p className="mt-1 text-sm text-ink/70">{subheading}</p>}
        </div>
      )}

      {/* honeypot */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="hidden"
        name="_subject"
        value="New consultation enquiry — gordonsalesguru.com"
      />

      <div className={`grid gap-4 sm:grid-cols-2`}>
        <Field label="Full name" htmlFor="lf-name">
          <input
            id="lf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Your name"
          />
        </Field>
        <Field label="Phone number" htmlFor="lf-phone">
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputCls}
            placeholder="+254 7xx xxx xxx"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email address" htmlFor="lf-email">
          <input
            id="lf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Product interest" htmlFor="lf-interest">
          <select id="lf-interest" name="interest" className={inputCls} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            {PRODUCT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project location (city / area)" htmlFor="lf-location">
        <input
          id="lf-location"
          name="location"
          type="text"
          className={inputCls}
          placeholder="e.g. Westlands, Nairobi"
        />
      </Field>

      <Field label="Project details — tell Gordon about your space" htmlFor="lf-details">
        <textarea
          id="lf-details"
          name="details"
          rows={compact ? 3 : 4}
          className={inputCls}
          placeholder="Room size, style you love, timeline, anything that helps…"
        />
      </Field>

      {status === "error" && (
        <p className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong —{" "}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            WhatsApp Gordon directly
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-navy mt-1 w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send to Gordon"}
      </button>

      <p className="text-center text-xs text-ink/50">
        Prefer to chat? {""}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue hover:underline"
        >
          Message Gordon on WhatsApp instead
        </a>
        .
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-card border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-base placeholder:text-ink/40 focus:border-accent focus:ring-2 focus:ring-accent/30";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      {children}
    </label>
  );
}
