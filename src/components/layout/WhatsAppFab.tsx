import { useData } from "@/lib/data-context";
import { generalWhatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  const { content } = useData();

  return (
    <a
      href={generalWhatsappLink(content.clinic.whatsapp)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with DentaCare Clinic on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_18px_40px_-14px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:-translate-y-0.5 sm:bottom-7 sm:right-7"
    >
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.09 3.34 5.1 4.55.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.79-.73 2.04-1.44.25-.71.25-1.31.18-1.44-.08-.13-.28-.2-.58-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.78-1.31l-.34-.2-3.55.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.02c0-5.19 4.23-9.41 9.42-9.41 2.52 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.42-9.44 9.42Zm8.02-17.44A11.31 11.31 0 0 0 12.05.75C5.8.75.72 5.83.72 12.07c0 2 .52 3.94 1.51 5.66L.62 23.25l5.66-1.48a11.28 11.28 0 0 0 5.77 1.56h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.31-8Z" />
        </svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-medium transition-all duration-300 group-hover:max-w-[11rem] sm:max-w-[11rem]">
        Chat on WhatsApp
      </span>
    </a>
  );
}
