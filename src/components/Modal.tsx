"use client";

import { useEffect, useRef } from "react";
import { Close } from "./Icons";

/** Accessible modal: backdrop click + ESC to close, body scroll lock. */
export default function Modal({
  open,
  onClose,
  children,
  labelledBy,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  size?: "lg" | "xl";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "xl" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={`relative z-10 max-h-[90vh] w-full ${maxW} overflow-auto rounded-card bg-white shadow-2xl animate-fade-in-up`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-pill bg-white/90 text-navy ring-1 ring-black/10 hover:bg-sky"
        >
          <Close className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
