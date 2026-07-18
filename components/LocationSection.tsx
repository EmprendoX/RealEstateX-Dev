"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev } from "@/data/development";
import SectionHeader from "./SectionHeader";

export default function LocationSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const loc = development.location;

  // OpenStreetMap embed — no API key needed, self-hosted feel
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${loc.longitude - 0.05},${loc.latitude - 0.03},${loc.longitude + 0.05},${loc.latitude + 0.03}&layer=mapnik&marker=${loc.latitude},${loc.longitude}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${loc.latitude}&mlon=${loc.longitude}#map=13/${loc.latitude}/${loc.longitude}`;

  return (
    <section id="ubicacion" className="relative py-24 md:py-32 bg-ink text-white">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("location.eyebrow")}
          heading={t("location.heading")}
          intro={tDev.text(loc.address, locale)}
          invert
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/11] w-full overflow-hidden border border-white/10 bg-white/5">
              <iframe
                src={mapSrc}
                title={development.name}
                className="w-full h-full grayscale contrast-125 opacity-90"
                loading="lazy"
              />
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-white/70 hover:text-white transition-colors"
            >
              {t("location.openMap")} →
            </a>
          </div>

          <div className="lg:col-span-5">
            <p className="text-eyebrow text-accent mb-6">{t("location.distancesLabel")}</p>
            <ul className="divide-y divide-white/10">
              {loc.distances.map((d, i) => (
                <li key={i} className="flex items-baseline justify-between py-4 gap-6">
                  <span className="text-base text-white/85">{tDev.text(d.label, locale)}</span>
                  <span className="font-display text-2xl text-white tabular-nums whitespace-nowrap">
                    {d.minutes} <span className="text-sm text-white/50">{t("location.minutes")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
