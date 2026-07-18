"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  development,
  t as tDev,
  getUnitsByModel,
  DevelopmentModel,
} from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import { openDossier } from "@/utils/dossier";
import SectionHeader from "./SectionHeader";

export default function ModelsSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [activeId, setActiveId] = useState(development.models[0].id);
  const active = development.models.find((m) => m.id === activeId) || development.models[0];
  const activeIndex = development.models.findIndex((m) => m.id === active.id);
  const allUnits = getUnitsByModel(development, active.id);
  const availableCount = allUnits.filter((u) => u.status === "available").length;
  const totalCount = allUnits.length;

  return (
    <section id="modelos" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("models.eyebrow")}
          heading={t("models.heading")}
          intro={t("models.intro")}
        />

        {/* Tab bar */}
        <div className="mt-16 border-b border-ink/15 overflow-x-auto">
          <div className="flex gap-0 min-w-max lg:min-w-0">
            {development.models.map((m, i) => {
              const isActive = m.id === active.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={`relative flex-1 lg:flex-none lg:min-w-[220px] px-6 lg:px-8 py-5 text-left transition-colors ${
                    isActive ? "text-ink" : "text-ink/45 hover:text-ink/70"
                  }`}
                >
                  <p className="text-eyebrow text-ink/50 mb-1">
                    {(i + 1).toString().padStart(2, "0")}
                  </p>
                  <p className={`font-display text-xl md:text-2xl leading-tight ${isActive ? "" : ""}`}>
                    {tDev.text(m.name, locale)}
                  </p>
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active model content */}
        <ModelBody
          key={active.id}
          model={active}
          index={activeIndex}
          available={availableCount}
          total={totalCount}
          locale={locale}
          t={t}
        />
      </div>
    </section>
  );
}

function ModelBody({
  model,
  index,
  available,
  total,
  locale,
  t,
}: {
  model: DevelopmentModel;
  index: number;
  available: number;
  total: number;
  locale?: string;
  t: (k: string, o?: any) => string;
}) {
  const image = model.renderImages[0] || development.galleryImages[0];
  const featuresList = tDev.list(model.features, locale);

  return (
    <div className="mt-12 lg:mt-16 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
            <Image
              src={image}
              alt={tDev.text(model.name, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="text-eyebrow text-primary mb-3">
            {t("models.modelNumber", { n: (index + 1).toString().padStart(2, "0") })}
          </p>
          <h3 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            {tDev.text(model.name, locale)}
          </h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70 mb-6 pb-6 border-b border-ink/10">
            <span>
              {model.bedrooms === 0
                ? t("models.studio")
                : t("models.bedrooms", { count: model.bedrooms })}
            </span>
            <span>{t("models.bathrooms", { count: model.bathrooms })}</span>
            <span>{t("models.area", { area: model.area })}</span>
            {model.areaExterior != null && (
              <span>{t("models.terrace", { area: model.areaExterior })}</span>
            )}
            {model.parking != null && (
              <span>{t("models.parking", { count: model.parking })}</span>
            )}
          </div>

          <p className="text-ink/75 leading-relaxed mb-6">
            {tDev.text(model.description, locale)}
          </p>

          {featuresList.length > 0 && (
            <ul className="space-y-1.5 mb-8">
              {featuresList.map((f, i) => (
                <li key={i} className="flex items-baseline gap-3 text-sm text-ink/80">
                  <span className="text-primary text-xs">■</span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-ink/10 pt-6 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-eyebrow text-ink/50 mb-1">{t("models.priceFrom")}</p>
              <p className="font-display text-3xl text-ink tabular-nums">
                {formatCurrency(model.priceFrom, development.currency, locale)}
              </p>
              {model.priceTo && model.priceTo > model.priceFrom && (
                <p className="text-xs text-ink/50 mt-1 tabular-nums">
                  {t("models.upTo")} {formatCurrency(model.priceTo, development.currency, locale)}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-eyebrow text-ink/50 mb-1">{t("models.availability")}</p>
              <p className="font-display text-2xl text-primary tabular-nums">
                {available}/{total}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="#disponibilidad"
              className="inline-flex items-center gap-2 bg-ink text-white px-6 py-3 text-xs uppercase tracking-eyebrow hover:bg-primary transition-colors"
            >
              {t("models.viewAvailability")} →
            </a>
            <button
              type="button"
              onClick={openDossier}
              className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3 text-xs uppercase tracking-eyebrow hover:border-ink transition-colors"
            >
              {t("models.requestDossier")}
            </button>
          </div>
        </div>
      </div>

      {/* Floor plan */}
      {model.floorPlanImage && (
        <div className="mt-16 lg:mt-24 pt-16 border-t border-ink/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[8/5] bg-white overflow-hidden">
              <img
                src={model.floorPlanImage}
                alt={`${tDev.text(model.name, locale)} — ${t("models.floorPlanAlt")}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="text-eyebrow text-primary mb-3">{t("models.floorPlanEyebrow")}</p>
            <h4 className="font-display text-2xl md:text-3xl leading-tight mb-4">
              {t("models.floorPlanHeading")}
            </h4>
            <p className="text-sm text-ink/70 leading-relaxed mb-6">
              {t("models.floorPlanBody")}
            </p>
            <button
              type="button"
              onClick={openDossier}
              className="inline-flex items-center gap-2 border border-ink text-ink px-6 py-3 text-xs uppercase tracking-eyebrow hover:bg-ink hover:text-white transition-colors"
            >
              {t("models.floorPlanCta")} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
