"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Close, ChevronLeft, ChevronRight } from "./Icons";
import { assetPath } from "@/lib/config";

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

/** Full-screen image lightbox with keyboard + button navigation. */
export default function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index! + 1) % items.length);
      if (e.key === "ArrowLeft")
        onIndexChange((index! - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, index, items.length, onClose, onIndexChange]);

  if (!isOpen) return null;
  const item = items[index!];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20"
      >
        <Close />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => onIndexChange((index! - 1 + items.length) % items.length)}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => onIndexChange((index! + 1) % items.length)}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight />
          </button>
        </>
      )}

      <div className="relative flex max-h-[82vh] w-full max-w-5xl flex-1 items-center justify-center">
        <Image
          src={assetPath(item.src)}
          alt={item.alt}
          width={1600}
          height={1100}
          sizes="100vw"
          className="max-h-[82vh] w-auto rounded-card object-contain"
        />
      </div>
      {item.caption && (
        <p className="mt-4 text-center text-sm text-white/80">{item.caption}</p>
      )}
    </div>
  );
}
