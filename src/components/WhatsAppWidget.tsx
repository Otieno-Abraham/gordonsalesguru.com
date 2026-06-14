"use client";

import { useEffect, useState } from "react";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";
import { WhatsAppIcon, Close } from "./Icons";

const STORAGE_KEY = "gsg_widget_dismissed";

/**
 * Auto-popup WhatsApp chat widget.
 * Appears 10s after load, remembers dismissal in localStorage, and does not
 * reappear once dismissed in the same session. English only.
 */
export default function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* localStorage unavailable — still show once */
    }
    const t = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-5 z-40 w-[min(22rem,calc(100vw-2.5rem))] animate-fade-in-up">
      <div className="overflow-hidden rounded-card bg-white shadow-xl ring-1 ring-black/10">
        <div className="flex items-center gap-3 bg-navy p-4 text-white">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-whatsapp">
            <WhatsAppIcon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{siteConfig.person.name}</p>
            <p className="truncate text-xs text-white/70">
              {siteConfig.person.tagline}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss chat"
            className="ml-auto rounded-pill p-1 text-white/70 hover:text-white"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="rounded-card bg-sky p-3 text-sm leading-relaxed text-ink">
            Hi there! 👋 I&apos;m Gordon. Looking for premium kitchen cabinets,
            wardrobes or interior fitouts in East Africa? I&apos;d love to help.
            Chat with me directly on WhatsApp — I respond within 2 hours.
          </p>
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Start Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
