"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev, OwnershipGoal } from "@/data/development";
import { siteConfig } from "@/config/siteConfig";
import { formatCurrency } from "@/utils/formatCurrency";

const CROSSFADE_MS = 8000;

export default function Hero() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [index, setIndex] = useState(0);
  const images = development.heroImages;
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, CROSSFADE_MS);
    return () => window.clearInterval(id);
  }, [hasMultiple, images.length]);

  const tagline = tDev.text(development.tagline, locale);
  const eyebrow = `${development.location.city.toUpperCase()} · ${development.location.state.toUpperCase()}`;

  const startingPrice = useMemo(() => {
    const min = Math.min(...development.models.map((m) => m.priceFrom));
    return formatCurrency(min, development.currency, locale);
  }, [locale]);

  const deliveryLabel = useMemo(() => {
    const [y, m] = development.deliveryDate.split("-");
    const q = Math.ceil(Number(m) / 3);
    return `${t("hero.deliveryPrefix")} Q${q} ${y}`;
  }, [t]);

  const metaLine = [
    t("hero.residencesCount", { count: development.totalUnits }),
    t("hero.priceFrom", { price: startingPrice }),
    deliveryLabel,
  ].join(" · ");

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden bg-ink text-white">
      {/* Image stack with crossfade + subtle Ken Burns */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-smooth"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <div className="relative w-full h-full animate-ken-burns">
              <Image
                src={src}
                alt={`${development.name} — ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content grid */}
      <div className="relative z-10 h-full">
        <div className="mx-auto h-full max-w-editorial px-6 lg:px-12">
          <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-8 items-end lg:items-center pb-24 lg:pb-32 pt-32">
            {/* Left / main content */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-end lg:justify-center h-full lg:h-auto">
              <div className="animate-fade-up">
                <p className="text-eyebrow text-white/85 mb-6 flex items-center gap-3">
                  <span
                    className="inline-block h-[1px] w-10"
                    style={{ backgroundColor: siteConfig.accentColor }}
                  />
                  {eyebrow}
                </p>

                <h1 className="font-display font-light tracking-tightest leading-[0.9] text-[15vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[8rem] mb-6">
                  {development.name}
                </h1>

                <p className="font-display italic text-white/95 text-2xl md:text-3xl lg:text-4xl leading-tight max-w-2xl mb-8">
                  {tagline}
                </p>

                <p className="text-sm md:text-base text-white/75 tracking-wide mb-10 max-w-2xl">
                  {metaLine}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#disponibilidad"
                    className="group inline-flex items-center justify-center gap-2 bg-white text-ink px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-white/90"
                  >
                    {t("hero.checkAvailability")}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                  <a
                    href="#brochure"
                    className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:border-white hover:bg-white/10"
                  >
                    {t("hero.downloadBrochure")}
                  </a>
                </div>
              </div>
            </div>

            {/* Right / inquiry mini-form (desktop only) */}
            <div className="hidden lg:col-span-5 xl:col-span-4 lg:flex justify-end animate-fade-up" style={{ animationDelay: "200ms" }}>
              <HeroInquiryForm />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop) */}
      <a
        href="#concepto"
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        aria-label={t("hero.scrollHint")}
      >
        <span className="text-eyebrow">{t("hero.scrollHint")}</span>
        <span className="block h-10 w-[1px] bg-white/40 animate-pulse" />
      </a>

      {/* Sticky inquiry bar (mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/10 px-4 py-3 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(t("hero.whatsappDefault", { name: development.name }))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center bg-[#25D366] text-white text-sm font-medium py-3 uppercase tracking-wide"
        >
          {t("hero.whatsappCta")}
        </a>
        <a
          href="#contacto"
          className="flex-1 inline-flex items-center justify-center bg-ink text-white text-sm font-medium py-3 uppercase tracking-wide"
        >
          {t("hero.inquiryCta")}
        </a>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Hero inquiry mini-form (desktop). Compact 4-field capture.
// ------------------------------------------------------------

function HeroInquiryForm() {
  const { t } = useTranslation("common");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [goal, setGoal] = useState<OwnershipGoal>("live");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !whatsapp.trim()) {
      setError(t("heroInquiry.required"));
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
          whatsapp: whatsapp.trim(),
          goal,
          source: "hero-inquiry",
          intent: "info",
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setName("");
      setWhatsapp("");
    } catch {
      setError(t("heroInquiry.sendError"));
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-sm bg-white/95 backdrop-blur-md text-ink shadow-2xl">
      <div className="border-b border-black/10 px-6 py-4">
        <p className="text-eyebrow text-primary">{t("heroInquiry.eyebrow")}</p>
        <p className="font-display text-xl leading-tight mt-1">{t("heroInquiry.title")}</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-black/60 mb-1.5" htmlFor="hero-name">
            {t("heroInquiry.name")}
          </label>
          <input
            id="hero-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-black/20 focus:border-primary focus:outline-none py-1.5 text-sm bg-transparent"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-black/60 mb-1.5" htmlFor="hero-whatsapp">
            {t("heroInquiry.whatsapp")}
          </label>
          <input
            id="hero-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full border-b border-black/20 focus:border-primary focus:outline-none py-1.5 text-sm bg-transparent"
            autoComplete="tel"
            required
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-black/60 mb-2">{t("heroInquiry.goalLabel")}</p>
          <div className="grid grid-cols-3 gap-1">
            {(["live", "invest", "both"] as OwnershipGoal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`text-xs py-2 px-1 border transition-colors ${
                  goal === g
                    ? "border-primary bg-primary text-white"
                    : "border-black/20 text-black/70 hover:border-black/40"
                }`}
              >
                {t(`heroInquiry.goal.${g}`)}
              </button>
            ))}
          </div>
        </div>

        {status === "error" && error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        {status === "success" && (
          <p className="text-xs text-green-700">{t("heroInquiry.success")}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-ink text-white text-sm uppercase tracking-wide py-3 hover:bg-primary transition-colors disabled:opacity-50"
        >
          {status === "loading" ? t("heroInquiry.sending") : t("heroInquiry.submit")}
        </button>

        <p className="text-[10px] text-black/50 text-center leading-relaxed">
          {t("heroInquiry.disclaimer")}
        </p>
      </form>
    </div>
  );
}
