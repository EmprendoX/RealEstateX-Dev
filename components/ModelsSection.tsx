"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import type { TFunction } from "i18next";
import {
  development,
  t as tDev,
  getUnitsByModel,
  DevelopmentModel,
} from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionHeader from "./SectionHeader";

export default function ModelsSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <section id="modelos" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("models.eyebrow")}
          heading={t("models.heading")}
          intro={t("models.intro")}
        />

        <div className="mt-16 space-y-24 lg:space-y-32">
          {development.models.map((model, index) => (
            <ModelBlock key={model.id} model={model} index={index} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelBlock({
  model,
  index,
  locale,
  t,
}: {
  model: DevelopmentModel;
  index: number;
  locale?: string;
  t: TFunction;
}) {
  const reversed = index % 2 === 1;
  const availableCount = getUnitsByModel(development, model.id).filter(
    (u) => u.status === "available"
  ).length;
  const totalCount = getUnitsByModel(development, model.id).length;
  const image = model.renderImages[0] || development.galleryImages[0];

  const featuresList = tDev.list(model.features, locale);

  return (
    <article className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}>
      <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
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

      <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
        <p className="text-eyebrow text-primary mb-3">
          {t("models.modelNumber", { n: (index + 1).toString().padStart(2, "0") })}
        </p>
        <h3 className="font-display text-4xl md:text-5xl leading-tight mb-4">
          {tDev.text(model.name, locale)}
        </h3>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70 mb-6">
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
            <p className="font-display text-3xl text-ink">
              {formatCurrency(model.priceFrom, development.currency, locale)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-eyebrow text-ink/50 mb-1">{t("models.availability")}</p>
            <p className="font-display text-2xl text-primary">
              {availableCount}/{totalCount}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={`#disponibilidad`}
            className="inline-flex items-center gap-2 bg-ink text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-primary transition-colors"
          >
            {t("models.viewAvailability")} →
          </a>
          <a
            href={`#contacto`}
            className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3 text-sm uppercase tracking-wide hover:border-ink transition-colors"
          >
            {t("models.requestInfo")}
          </a>
        </div>
      </div>
    </article>
  );
}
