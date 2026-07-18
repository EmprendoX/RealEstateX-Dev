"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { development, OwnershipGoal } from "@/data/development";

/**
 * Persistent floating "Solicitar dossier privado" button — appears after
 * the user scrolls past the hero. Click opens a compact modal form that
 * POSTs to /api/lead with source="dossier-cta", intent="dossier".
 *
 * Replaces the mini inquiry form that used to live inside the hero. The
 * hero now stays focused on the product; capture is always one click away
 * without competing for attention above the fold.
 */
export default function DossierCTA() {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show once the user has scrolled past ~85% of the hero.
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Sticky floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("dossier.openLabel")}
        className={`fixed z-40 bottom-6 right-6 lg:bottom-8 lg:right-8 bg-ink text-white shadow-xl transition-all duration-500 hover:bg-primary group ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <span className="inline-flex items-center gap-3 px-5 lg:px-6 py-3.5 lg:py-4 text-xs uppercase tracking-eyebrow">
          <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-white transition-colors" />
          {t("dossier.ctaLabel")}
        </span>
      </button>

      {open && <DossierModal onClose={() => setOpen(false)} />}
    </>
  );
}

function DossierModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation("common");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [goal, setGoal] = useState<OwnershipGoal>("invest");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !whatsapp.trim() || !email.trim()) {
      setError(t("dossier.required"));
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("dossier.invalidEmail"));
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          goal,
          source: "dossier-cta",
          intent: "dossier",
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setError(t("dossier.sendError"));
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-ink/80 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-white text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-ink/50 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        <div className="px-8 py-8 border-b border-ink/10">
          <p className="text-eyebrow text-primary mb-3">{t("dossier.eyebrow")}</p>
          <h2 className="font-display text-2xl md:text-3xl leading-tight">
            {t("dossier.title", { name: development.name })}
          </h2>
          <p className="text-sm text-ink/60 mt-3">{t("dossier.subtitle")}</p>
        </div>

        {status === "success" ? (
          <div className="px-8 py-10 text-center">
            <p className="text-eyebrow text-primary mb-3">{t("dossier.successEyebrow")}</p>
            <p className="font-display text-2xl leading-tight mb-3">
              {t("dossier.successHeading", { name: name.split(" ")[0] })}
            </p>
            <p className="text-sm text-ink/70 max-w-sm mx-auto">{t("dossier.successBody")}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 text-xs uppercase tracking-eyebrow text-ink/50 hover:text-ink"
            >
              {t("dossier.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-8 py-6 space-y-5">
            <MiniField label={t("dossier.name")}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                autoComplete="name"
                required
              />
            </MiniField>
            <MiniField label={t("dossier.email")}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                autoComplete="email"
                required
              />
            </MiniField>
            <MiniField label={t("dossier.whatsapp")}>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                autoComplete="tel"
                required
              />
            </MiniField>

            <div>
              <p className="text-xs uppercase tracking-eyebrow text-ink/60 mb-2">{t("dossier.goalLabel")}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["live", "invest", "both"] as OwnershipGoal[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`py-2.5 text-xs uppercase tracking-eyebrow border transition-colors ${
                      goal === g
                        ? "border-primary bg-primary text-white"
                        : "border-ink/20 text-ink/70 hover:border-ink/40"
                    }`}
                  >
                    {t(`dossier.goals.${g}`)}
                  </button>
                ))}
              </div>
            </div>

            {status === "error" && error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-ink text-white py-4 text-xs uppercase tracking-eyebrow hover:bg-primary transition-colors disabled:opacity-50"
            >
              {status === "loading" ? t("dossier.sending") : t("dossier.submit")}
            </button>

            <p className="text-[10px] text-ink/50 text-center leading-relaxed">
              {t("dossier.disclaimer")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-eyebrow text-ink/60 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
