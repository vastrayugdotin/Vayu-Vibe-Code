"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// PopupManager — Client-side popup orchestration
// Reference: component_architecture.md §4.8
//
// Fetches active popups from GET /api/storefront/popups and
// evaluates trigger rules client-side:
//   - DELAY: setTimeout(triggerValue * 1000)
//   - SCROLL_DEPTH: window scroll event % check
//   - EXIT_INTENT: mouseleave on document (desktop only)
//
// Respects frequency:
//   - ONCE_SESSION → sessionStorage
//   - ONCE_EVER    → localStorage
//   - EVERY_VISIT  → always show
// ─────────────────────────────────────────────────────────────

interface PopupContent {
  heading?: string;
  body?: string;
  image_url?: string;
  cta_text?: string;
  cta_link?: string;
  show_email_form?: boolean;
  email_placeholder?: string;
  submit_text?: string;
}

interface PopupData {
  id: string;
  title: string;
  content_json: PopupContent;
  trigger_type: "DELAY" | "SCROLL_DEPTH" | "EXIT_INTENT";
  trigger_value: number;
  frequency: "ONCE_SESSION" | "ONCE_EVER" | "EVERY_VISIT";
}

export default function PopupManager() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [activePopup, setActivePopup] = useState<PopupData | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/storefront/popups")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.data?.length) {
          setPopups(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch popups:", err);
      });
  }, []);

  useEffect(() => {
    if (popups.length === 0) return;

    const cleanups: (() => void)[] = [];

    for (const popup of popups) {
      // Check frequency — skip if already shown per rules
      const storageKey = `vastrayug_popup_${popup.id}`;
      if (popup.frequency === "ONCE_EVER" && localStorage.getItem(storageKey)) {
        continue;
      }
      if (
        popup.frequency === "ONCE_SESSION" &&
        sessionStorage.getItem(storageKey)
      ) {
        continue;
      }

      if (popup.trigger_type === "DELAY") {
        const timer = setTimeout(
          () => {
            setActivePopup(popup);
          },
          (popup.trigger_value || 0) * 1000,
        );
        cleanups.push(() => clearTimeout(timer));
      }

      if (popup.trigger_type === "SCROLL_DEPTH") {
        const handler = () => {
          const scrollPercent =
            (window.scrollY /
              (document.documentElement.scrollHeight - window.innerHeight)) *
            100;
          if (scrollPercent >= (popup.trigger_value || 0)) {
            setActivePopup(popup);
            window.removeEventListener("scroll", handler);
          }
        };
        window.addEventListener("scroll", handler, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", handler));
      }

      if (popup.trigger_type === "EXIT_INTENT") {
        const handler = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setActivePopup(popup);
            document.removeEventListener("mouseleave", handler);
          }
        };
        document.addEventListener("mouseleave", handler);
        cleanups.push(() =>
          document.removeEventListener("mouseleave", handler),
        );
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [popups]);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (activePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePopup]);

  function dismissPopup() {
    if (!activePopup) return;
    const storageKey = `vastrayug_popup_${activePopup.id}`;
    if (activePopup.frequency === "ONCE_EVER") {
      localStorage.setItem(storageKey, "1");
    }
    if (activePopup.frequency === "ONCE_SESSION") {
      sessionStorage.setItem(storageKey, "1");
    }
    setActivePopup(null);
    setSubmitSuccess(false);
    setEmail("");
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/storefront/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          dismissPopup();
        }, 3000);
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activePopup) return null;

  const content = activePopup.content_json || {};

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cosmic-black/80 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={dismissPopup}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-deep-indigo shadow-cosmic animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismissPopup}
          className="absolute right-4 top-4 z-10 p-2 text-stardust-white/60 hover:text-nebula-gold transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-gold/50 rounded-full"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {content.image_url && (
          <div className="w-full h-48 bg-cosmic-black overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt={content.heading || "Vastrayug"}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-indigo to-transparent" />
          </div>
        )}

        <div className={`p-8 ${content.image_url ? "pt-4" : "pt-10"}`}>
          <div className="text-center mb-8">
            {content.heading && (
              <h2
                id="popup-title"
                className="font-heading text-3xl text-nebula-gold mb-4 tracking-wide"
              >
                {content.heading}
              </h2>
            )}

            {content.body && (
              <p className="text-stardust-white/80 font-body text-base leading-relaxed">
                {content.body}
              </p>
            )}
          </div>

          {content.show_email_form ? (
            submitSuccess ? (
              <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 text-center animate-in fade-in duration-300">
                <p className="text-green-400 font-body text-sm font-medium">
                  Welcome to the universe. Your alignment begins now.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.email_placeholder || "Enter your email"}
                  className="w-full bg-cosmic-black border border-white/10 rounded-md px-4 py-3 text-stardust-white focus:outline-none focus:border-nebula-gold transition-colors font-body"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nebula-gold text-cosmic-black font-semibold font-body py-3 rounded-md hover:bg-stardust-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Aligning..."
                    : content.submit_text || "Subscribe"}
                </button>
              </form>
            )
          ) : (
            content.cta_link &&
            content.cta_text && (
              <Link
                href={content.cta_link}
                onClick={dismissPopup}
                className="block w-full text-center bg-nebula-gold text-cosmic-black font-semibold font-body py-3 rounded-md hover:bg-stardust-white transition-colors"
              >
                {content.cta_text}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
