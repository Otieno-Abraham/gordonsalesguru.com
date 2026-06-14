"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/config";
import { Menu, Close } from "./Icons";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-base ${
        scrolled
          ? "border-black/5 bg-white/95 backdrop-blur"
          : "border-transparent bg-white"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="flex items-center gap-1 text-lg font-semibold lg:text-xl">
          <span className="text-navy">Gordon</span>
          <span className="text-accent">SalesGuru</span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-base hover:text-accent ${
                isActive(l.href) ? "text-accent" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact/" className="btn-navy">
            Get a Free Consultation
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-card p-2 text-navy lg:hidden"
        >
          {open ? <Close /> : <Menu />}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-card px-2 py-3 text-base font-medium ${
                  isActive(l.href) ? "bg-sky text-accent" : "text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact/" className="btn-navy mt-2 w-full">
              Get a Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
