"use client";

import { useState } from "react";
import Modal from "./Modal";
import LeadForm from "./LeadForm";

/** A CTA button that opens the lead form in a modal (used on /products, /projects). */
export default function LeadModalButton({
  label = "Request a Quote",
  variant = "navy",
  heading = "Request a Free Consultation",
  className = "",
}: {
  label?: string;
  variant?: "navy" | "accent" | "outline" | "outline-light";
  heading?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const btn =
    variant === "accent"
      ? "btn-accent"
      : variant === "outline"
      ? "btn-outline"
      : variant === "outline-light"
      ? "btn-outline-light"
      : "btn-navy";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${btn} ${className}`}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="lead-modal-heading">
        <div className="p-6 sm:p-8">
          <LeadForm heading={heading} id="lead-modal-heading" compact />
        </div>
      </Modal>
    </>
  );
}
