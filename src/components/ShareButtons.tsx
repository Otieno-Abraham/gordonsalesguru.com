"use client";

import { useState } from "react";
import { WhatsAppIcon, Link as LinkIcon, Check } from "./Icons";
import { absoluteUrl } from "@/lib/seo";

/** Blog share row — WhatsApp share (most important) + copy link. */
export default function ShareButtons({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-navy">Share:</span>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp !py-2 text-xs"
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </a>
      <button type="button" onClick={copy} className="btn-outline !py-2 text-xs">
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
