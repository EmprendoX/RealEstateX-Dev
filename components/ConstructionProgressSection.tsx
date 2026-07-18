"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev } from "@/data/development";
import SectionHeader from "./SectionHeader";

const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(iso: string, locale?: string): string {
  const [y, m] = iso.split("-");
  const idx = Math.max(0, Math.min(11, Number(m) - 1));
  const months = locale === "en" ? MONTHS_EN : MONTHS_ES;
  return `${months[idx]} ${y}`;
}

export default function ConstructionProgressSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const overallPercent = Math.round(
    (development.construction.filter((c) => c.status === "completed").length /
      development.construction.length) *
      100 +
      (development.construction.find((c) => c.status === "in_progress")?.progressPercent || 0) /
        development.construction.length
  );

  return (
    <section id="avance" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-8">
            <SectionHeader
              eyebrow={t("progress.eyebrow")}
              heading={t("progress.heading")}
              intro={t("progress.intro", { date: formatDate(development.deliveryDate, locale) })}
            />
          </div>
          <div className="lg:col-span-4">
            <p className="text-eyebrow text-ink/60 mb-2">{t("progress.overallLabel")}</p>
            <p className="font-display text-6xl text-primary leading-none">{overallPercent}%</p>
            <div className="mt-4 h-1 w-full bg-ink/10 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="relative">
          {/* vertical guideline */}
          <div className="absolute left-3 md:left-4 top-2 bottom-2 w-px bg-ink/15" aria-hidden />

          <ul className="space-y-8">
            {development.construction.map((m) => {
              const dot =
                m.status === "completed"
                  ? "bg-primary border-primary"
                  : m.status === "in_progress"
                  ? "bg-accent border-accent animate-pulse"
                  : "bg-surface border-ink/30";

              return (
                <li key={m.id} className="relative pl-10 md:pl-14">
                  <span
                    className={`absolute left-0 top-1 w-6 md:w-8 h-6 md:h-8 border-2 rounded-full ${dot}`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <p className="text-eyebrow text-ink/50">{formatDate(m.date, locale)}</p>
                    <span
                      className={`text-eyebrow px-2 py-0.5 ${
                        m.status === "completed"
                          ? "text-primary bg-primary/10"
                          : m.status === "in_progress"
                          ? "text-accent bg-accent/15"
                          : "text-ink/50 bg-ink/5"
                      }`}
                    >
                      {t(`progress.status.${m.status}`)}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight mb-2">
                    {tDev.text(m.title, locale)}
                  </h3>
                  {m.notes && (
                    <p className="text-sm text-ink/70 max-w-2xl leading-relaxed">
                      {tDev.text(m.notes, locale)}
                    </p>
                  )}
                  {m.status === "in_progress" && m.progressPercent != null && (
                    <div className="mt-3 max-w-md">
                      <div className="flex items-baseline justify-between mb-1 text-xs text-ink/60">
                        <span>{t("progress.milestoneProgress")}</span>
                        <span className="tabular-nums">{m.progressPercent}%</span>
                      </div>
                      <div className="h-1 w-full bg-ink/10 overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${m.progressPercent}%` }} />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
