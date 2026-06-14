"use client";

import { whatsappLink, whatsappMessages } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

/** Floating, pulsing WhatsApp button — present on every page, bottom right. */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(whatsappMessages.default)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gordon on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-pill bg-whatsapp text-white shadow-lg shadow-black/20 animate-pulse-ring transition-base hover:brightness-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
