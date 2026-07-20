import { getWhatsAppUrl } from "@/lib/services/whatsapp";

type WhatsAppCtaProps = {
  className?: string;
  label?: string;
  message?: string;
  showIcon?: boolean;
};

export function WhatsAppCta({
  className,
  label = "Chat on WhatsApp",
  message = "Hi Moosiva, I'd like to know more about your collection.",
  showIcon = false,
}: WhatsAppCtaProps) {
  const url = getWhatsAppUrl(message);

  if (!url) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {showIcon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
          <path d="M8.5 8.2c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.7 2.1 2.2.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.6-.5.5-1.3.8-2.1.6-1-.2-2.3-.7-3.9-2.1-1.3-1.2-2.2-2.7-2.5-3.7-.3-1 0-1.8.3-2.2Z" />
        </svg>
      ) : null}
      {label}
    </a>
  );
}
