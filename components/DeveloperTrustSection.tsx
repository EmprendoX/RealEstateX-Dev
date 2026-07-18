"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev } from "@/data/development";
import SectionHeader from "./SectionHeader";

export default function DeveloperTrustSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const dev = development.developer;

  const stats: Array<{ value: string | number; label: string }> = [];
  if (dev.founded) stats.push({ value: new Date().getFullYear() - dev.founded, label: t("developer.yearsExperience") });
  if (dev.projectsDelivered) stats.push({ value: dev.projectsDelivered, label: t("developer.projectsDelivered") });
  if (dev.totalUnitsDelivered) stats.push({ value: dev.totalUnitsDelivered, label: t("developer.unitsDelivered") });

  return (
    <section id="desarrollador" className="relative py-24 md:py-32 bg-white text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow={t("developer.eyebrow")}
              heading={dev.name}
            />
            <p className="mt-8 text-lg leading-relaxed text-ink/75 whitespace-pre-line">
              {tDev.text(dev.description, locale)}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-ink/10 p-8 lg:p-10 bg-surface">
              <p className="text-eyebrow text-primary mb-8">{t("developer.trackRecord")}</p>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <div key={i}>
                    <p className="font-display text-4xl lg:text-5xl leading-none text-ink tabular-nums">
                      {typeof s.value === "number" && s.value >= 100 ? s.value : `+${s.value}`}
                    </p>
                    <p className="text-xs text-ink/60 mt-3 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-ink/10">
                <p className="text-eyebrow text-ink/60 mb-3">{t("developer.legalLabel")}</p>
                <p className="text-sm text-ink/75 leading-relaxed">
                  {t("developer.legalNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
