"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev } from "@/data/development";
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

  const eyebrow = `${development.name.toUpperCase()} — ${development.location.state === "Baja California Sur" ? "EAST CAPE" : development.location.city.toUpperCase()}`;

  const startingPrice = useMemo(() => {
    const min = Math.min(...development.models.map((m) => m.priceFrom));
    return formatCurrency(min, development.currency, locale);
  }, [locale]);

  const deliveryLabel = useMemo(() => {
    const [y, m] = development.deliveryDate.split("-");
    const q = Math.ceil(Number(m) / 3);
    return `Q${q} ${y}`;
  }, []);

  const headline = tDev.text(development.heroHeadline, locale);
  const points = tDev.list(development.heroPoints, locale);

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden bg-ink text-white">
      {/* Background — prefers heroVideoUrl if set; otherwise image crossfade. */}
      <div className="absolute inset-0 z-0">
        {development.heroVideoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.72) contrast(1.05) saturate(0.95)" }}
            autoPlay
            muted
            loop
            playsInline
            poster={images[0]}
          >
            <source src={development.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          images.map((src, i) => (
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
                  style={{ filter: "brightness(0.72) contrast(1.05) saturate(0.95)" }}
                />
              </div>
            </div>
          ))
        )}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Editorial composition — bottom-left anchored */}
      <div className="relative z-10 h-full">
        <div className="mx-auto h-full max-w-editorial px-6 lg:px-12 flex flex-col justify-end pb-24 lg:pb-32">
          <div className="max-w-4xl animate-fade-up hero-text-shadow">
            <p className="text-eyebrow text-white mb-8">{eyebrow}</p>

            <h1 className="font-display font-light tracking-tightest leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] mb-8 max-w-4xl">
              {headline}
            </h1>

            {points.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white text-sm md:text-base mb-8">
                {points.map((p, i) => (
                  <React.Fragment key={p}>
                    {i > 0 && <span className="text-white/50">·</span>}
                    <span>{p}</span>
                  </React.Fragment>
                ))}
              </div>
            )}

            <p className="text-sm md:text-base text-white/90 tracking-wide mb-10">
              {t("hero.priceFrom", { price: startingPrice })} · {t("hero.deliveryPrefix")} {deliveryLabel}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#modelos"
                className="group inline-flex items-center justify-center gap-2 bg-white text-ink px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-white/90"
              >
                {t("hero.exploreCta")}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                {t("hero.dossierCta")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop) */}
      <a
        href="#concepto"
        className="hidden lg:flex absolute bottom-8 right-8 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        aria-label={t("hero.scrollHint")}
      >
        <span className="text-eyebrow">{t("hero.scrollHint")}</span>
        <span className="block h-10 w-[1px] bg-white/40" />
      </a>

      {/* Slide indicator dots (only for image crossfade, not for video) */}
      {!development.heroVideoUrl && hasMultiple && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-[2px] transition-all duration-500 ${
                i === index ? "bg-white w-8" : "bg-white/40 w-4 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
