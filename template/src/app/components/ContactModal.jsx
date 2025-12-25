import { useEffect, useRef } from "react";
import { registerTangerineComponent } from "../../lib/registry.js";
import { trackEvent } from "../utils/analytics.js";
import { getContact, getSocial, getBrand } from "../../config/loader.js";

const ContactModalComponent = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Get contact info from config
  let contactInfo = { email: "", phone: "", whatsapp: "" };
  let socialInfo = { instagram: "" };
  let brandName = "Notre boutique";

  try {
    contactInfo = getContact();
    socialInfo = getSocial();
    brandName = getBrand().name;
  } catch (error) {
    console.warn("Failed to load contact info from config:", error);
  }

  useEffect(() => {
    if (!isOpen) return undefined;
    const focusables = () => {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
    };
    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const node = dialogRef.current;
    node?.addEventListener("keydown", onKeyDown);
    (closeRef.current || node)?.focus();
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      <div
        className="glass-dark rounded-3xl max-w-md w-full animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <h3 id="contact-title" className="text-2xl font-bold text-white">
              Contact
            </h3>
          </div>
          <button
            onClick={onClose}
            className="group relative z-50"
            aria-label="Fermer"
            ref={closeRef}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative px-4 py-3 rounded-2xl glass backdrop-blur-2xl border border-white/10 shadow-2xl group-hover:border-white/20 group-hover:bg-white/5 transition-all duration-300 active:scale-95">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/70 group-hover:text-white transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors duration-300 tracking-wide">
                    RETOUR
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <h4 className="text-white font-bold text-xl mb-2">
              Contactez-nous
            </h4>
            <p className="text-white/60 text-sm mb-6">
              {brandName}
            </p>
          </div>

          <div className="space-y-2">
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                onClick={() => trackEvent("contact_email_click")}
                className="flex items-center gap-3 w-full glass hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-95"
              >
                <span className="text-xl">📧</span>
                <span className="flex-1 text-left">{contactInfo.email}</span>
              </a>
            )}

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                onClick={() => trackEvent("contact_phone_click")}
                className="flex items-center gap-3 w-full glass hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-95"
              >
                <span className="text-xl">📱</span>
                <span className="flex-1 text-left">{contactInfo.phone}</span>
              </a>
            )}

            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("contact_whatsapp_click")}
                className="flex items-center gap-3 w-full glass hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-95"
              >
                <span className="text-xl">💬</span>
                <span className="flex-1 text-left">WhatsApp</span>
              </a>
            )}

            {socialInfo.instagram && (
              <a
                href={socialInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("contact_instagram_click")}
                className="flex items-center gap-3 w-full glass hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-95"
              >
                <span className="text-xl">📸</span>
                <span className="flex-1 text-left">Instagram</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactModal = registerTangerineComponent(
  "ContactModal",
  ContactModalComponent,
);

export default ContactModal;
