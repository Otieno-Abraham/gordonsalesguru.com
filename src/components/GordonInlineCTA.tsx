import { WhatsAppIcon } from "./Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";

/**
 * Inline mid-post call-to-action used inside blog articles (drop <GordonInlineCTA />
 * anywhere in an MDX post). Server component.
 */
export default function GordonInlineCTA({ topic }: { topic?: string }) {
  const message = topic ? whatsappMessages.blog(topic) : whatsappMessages.default;
  return (
    <aside className="not-prose my-8 flex flex-col items-start gap-3 rounded-card bg-sky p-6 ring-1 ring-accent/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base font-semibold text-navy">
        Interested in this style? WhatsApp Gordon directly.
      </p>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp shrink-0"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Chat with Gordon
      </a>
    </aside>
  );
}
