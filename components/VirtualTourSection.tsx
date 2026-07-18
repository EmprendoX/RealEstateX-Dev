"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { development } from "@/data/development";
import { openDossier } from "@/utils/dossier";
import SectionHeader from "./SectionHeader";

type Provider = "matterport" | "youtube" | "vimeo" | "generic";

function detectProvider(url: string): Provider {
  if (/matterport\.com/i.test(url)) return "matterport";
  if (/(youtube\.com|youtu\.be)/i.test(url)) return "youtube";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  return "generic";
}

function toEmbedUrl(url: string, provider: Provider): string {
  if (provider === "matterport") return url;
  if (provider === "youtube") {
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    const watchMatch = url.match(/[?&]v=([\w-]+)/);
    const id = shortMatch?.[1] || watchMatch?.[1];
    return id
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      : url;
  }
  if (provider === "vimeo") {
    const id = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?title=0&byline=0` : url;
  }
  return url;
}

export default function VirtualTourSection() {
  const { t } = useTranslation("common");
  const url = development.virtualTourUrl;
  const provider = url ? (development.virtualTourProvider || detectProvider(url)) : null;
  const embedSrc = url && provider ? toEmbedUrl(url, provider) : null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !embedSrc) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [embedSrc]);

  return (
    <section id="tour-virtual" className="relative py-24 md:py-32 bg-ink text-white">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
          <div className="lg:col-span-8">
            <SectionHeader
              eyebrow={t("virtualTour.eyebrow")}
              heading={t("virtualTour.heading")}
              intro={t("virtualTour.intro")}
              invert
            />
          </div>
          <div className="lg:col-span-4 lg:text-right">
            {embedSrc && provider && (
              <p className="text-eyebrow text-white/50">
                {t(`virtualTour.provider.${provider}`)}
              </p>
            )}
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative aspect-[16/10] w-full bg-white/5 border border-white/10 overflow-hidden"
        >
          {!embedSrc ? (
            <TourPlaceholder t={t} />
          ) : !activated ? (
            <TourPoster
              inView={inView}
              onActivate={() => setActivated(true)}
              t={t}
            />
          ) : (
            <iframe
              src={embedSrc}
              title={`${development.name} — virtual tour`}
              className="absolute inset-0 w-full h-full"
              allow="fullscreen; xr-spatial-tracking; autoplay"
              loading="lazy"
              allowFullScreen
            />
          )}
        </div>

        {embedSrc && (
          <p className="mt-4 text-xs text-white/50">
            {t("virtualTour.disclaimer")}
          </p>
        )}
      </div>
    </section>
  );
}

function TourPlaceholder({ t }: { t: (k: string) => string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <div className="w-14 h-14 border border-accent flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.25} className="text-accent">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20" />
        </svg>
      </div>
      <p className="font-display text-2xl md:text-3xl leading-tight mb-3">
        {t("virtualTour.placeholderHeading")}
      </p>
      <p className="text-sm text-white/60 max-w-md">
        {t("virtualTour.placeholderBody")}
      </p>
      <button
        type="button"
        onClick={openDossier}
        className="mt-8 inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 text-xs uppercase tracking-eyebrow hover:bg-white hover:text-ink transition-colors"
      >
        {t("virtualTour.placeholderCta")} →
      </button>
    </div>
  );
}

function TourPoster({
  inView,
  onActivate,
  t,
}: {
  inView: boolean;
  onActivate: () => void;
  t: (k: string) => string;
}) {
  const poster = development.galleryImages[0] || development.heroImages[0];
  return (
    <button
      type="button"
      onClick={onActivate}
      className="absolute inset-0 group focus:outline-none"
      aria-label={t("virtualTour.startCta")}
    >
      {inView && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/20 transition-colors" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </span>
        <span className="font-display text-2xl md:text-3xl">
          {t("virtualTour.startCta")}
        </span>
        <span className="text-xs uppercase tracking-eyebrow text-white/70 mt-2">
          {t("virtualTour.startHint")}
        </span>
      </div>
    </button>
  );
}
