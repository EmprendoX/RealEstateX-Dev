"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { siteConfig } from "@/config/siteConfig";
import { development } from "@/data/development";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { key: "concept", href: "#concepto" },
  { key: "location", href: "#ubicacion" },
  { key: "amenities", href: "#amenidades" },
  { key: "models", href: "#modelos" },
  { key: "availability", href: "#disponibilidad" },
  { key: "payment", href: "#plan-de-pagos" },
  { key: "investment", href: "#inversion" },
  { key: "progress", href: "#avance" },
];

export default function Navbar() {
  const { t } = useTranslation("common");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    t("nav.whatsappDefault", { name: development.name })
  )}`;

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-ink/10 text-ink"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              {siteConfig.logoUrl ? (
                <img src={siteConfig.logoUrl} alt={siteConfig.siteName} className="h-8 w-auto" />
              ) : (
                <span className="font-display text-2xl tracking-tightest">{siteConfig.logoText}</span>
              )}
            </Link>

            <div className="hidden xl:flex items-center gap-6 ml-8 mr-4 flex-1 justify-center">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`text-xs uppercase tracking-eyebrow whitespace-nowrap transition-colors ${
                    scrolled ? "text-ink/70 hover:text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher invert={!scrolled} />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs uppercase tracking-eyebrow transition-colors ${
                  scrolled ? "text-ink/70 hover:text-primary" : "text-white/80 hover:text-white"
                }`}
              >
                WhatsApp
              </a>
              <a
                href="#contacto"
                className={`text-xs uppercase tracking-eyebrow whitespace-nowrap px-5 py-2.5 transition-colors ${
                  scrolled
                    ? "bg-ink text-white hover:bg-primary"
                    : "bg-white text-ink hover:bg-white/90"
                }`}
              >
                {t("nav.contact")}
              </a>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-ink text-white flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <span className="font-display text-2xl">{siteConfig.logoText}</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-3xl py-3 border-b border-white/10 text-white hover:text-accent"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#25D366] text-white text-center py-4 text-sm uppercase tracking-wide"
              >
                WhatsApp
              </a>
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="block bg-white text-ink text-center py-4 text-sm uppercase tracking-wide"
              >
                {t("nav.checkAvailability")}
              </a>
              <div className="pt-6 flex justify-center">
                <LanguageSwitcher invert />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
