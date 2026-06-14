import Link from "next/link";
import { WhatsAppIcon, ArrowRight } from "@/components/Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";

/**
 * Branded 404 page. Next.js static export emits this as /404.html, which
 * GitHub Pages serves automatically for unknown routes.
 */
export const metadata = {
  title: "Page Not Found | Gordon Odhiambo | Interior Solutions Expert",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="hero-texture flex min-h-[70vh] items-center text-white">
      <div className="container-x text-center">
        <p className="text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-4 h2">This page took a different turn</h1>
        <p className="mx-auto mt-4 max-w-lg text-white/80">
          The page you&apos;re looking for isn&apos;t here — but Gordon is. Head back home or
          message him directly and he&apos;ll point you in the right direction.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-accent">
            Back to Home <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp Gordon
          </a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
          <Link href="/products/" className="hover:text-accent">Products</Link>
          <Link href="/projects/" className="hover:text-accent">Projects</Link>
          <Link href="/blog/" className="hover:text-accent">Blog</Link>
          <Link href="/about/" className="hover:text-accent">About</Link>
          <Link href="/contact/" className="hover:text-accent">Contact</Link>
        </div>
      </div>
    </section>
  );
}
