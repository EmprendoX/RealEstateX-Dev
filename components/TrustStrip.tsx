"use client";

import React from "react";
import { useTranslation } from "next-i18next";
import { development } from "@/data/development";
import { siteConfig } from "@/config/siteConfig";

export default function TrustStrip() {
  const { t } = useTranslation("common");
  const dev = development.developer;

  const stats: Array<{ value: string; label: string }> = [];
  if (dev.founded) {
    stats.push({
      value: `${new Date().getFullYear() - dev.founded}`,
      label: t("trustStrip.yearsExperience"),
    });
  }
  if (dev.projectsDelivered) {
    stats.push({
      value: `${dev.projectsDelivered}`,
      label: t("trustStrip.projectsDelivered"),
    });
  }
  if (dev.totalUnitsDelivered) {
    stats.push({
      value: `${dev.totalUnitsDelivered}`,
      label: t("trustStrip.unitsDelivered"),
    });
  }

  return (
    <section className="relative bg-ink text-white py-14 md:py-20">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-4">
            <p className="text-eyebrow text-accent mb-2">{t("trustStrip.eyebrow")}</p>
            <p className="font-display text-3xl lg:text-4xl leading-tight text-white">
              {siteConfig.developerCompany}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-6 lg:gap-10">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="font-display text-4xl lg:text-5xl leading-none text-white tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs text-white/60 mt-3 leading-tight uppercase tracking-eyebrow">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 lg:text-right">
            <a
              href="#desarrollador"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-eyebrow text-white/85 hover:text-accent transition-colors"
            >
              {t("trustStrip.link")} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
