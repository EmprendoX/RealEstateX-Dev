"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev, Amenity } from "@/data/development";
import SectionHeader from "./SectionHeader";

// Minimal inline SVG icons — no external library. Keyed by amenity.icon.
const ICONS: Record<string, React.ReactNode> = {
  waves: (
    <path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 6c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  ),
  umbrella: (
    <>
      <path d="M12 2v2M22 12a10 10 0 0 0-20 0" />
      <path d="M12 12v10a2 2 0 0 1-4 0" />
    </>
  ),
  flame: (
    <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4-.5 3 1 4 2 4-2-2 0-6 0-9z" />
  ),
  utensils: (
    <>
      <path d="M4 3v7a2 2 0 0 0 2 2h1v9M7 3v7M15 3c-2 0-3 2-3 5s1 5 3 5v8" />
    </>
  ),
  laptop: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="1" />
      <path d="M1 20h22" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v15M5 15a7 7 0 0 0 14 0M3 15h4M17 15h4" />
    </>
  ),
  wine: (
    <>
      <path d="M8 2h8M6 2v6a6 6 0 0 0 12 0V2M12 14v6M8 22h8" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M6 4v16M18 4v16M2 8v8M22 8v8M6 12h12" />
    </>
  ),
  "concierge-bell": (
    <>
      <path d="M2 20h20M4 20a8 8 0 0 1 16 0M12 8V4M9 4h6" />
    </>
  ),
};

function AmenityIcon({ name }: { name: string }) {
  const path = ICONS[name] || ICONS.sun;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
      aria-hidden
    >
      {path}
    </svg>
  );
}

export default function AmenitiesSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <section id="amenidades" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <SectionHeader
              eyebrow={t("amenities.eyebrow")}
              heading={t("amenities.heading")}
              intro={t("amenities.intro")}
            />
          </div>
          <div className="lg:col-span-4 hidden lg:block text-right">
            <p className="font-display text-6xl text-primary/40">
              {development.amenities.length.toString().padStart(2, "0")}
            </p>
            <p className="text-eyebrow text-ink/60">{t("amenities.countLabel")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 border-t border-ink/10 pt-16">
          {development.amenities.map((a: Amenity, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-5">
                <span className="text-primary shrink-0 pt-1">
                  <AmenityIcon name={a.icon} />
                </span>
                <div>
                  <h3 className="font-display text-xl text-ink mb-2 leading-tight">
                    {tDev.text(a.name, locale)}
                  </h3>
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {tDev.text(a.description, locale)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
