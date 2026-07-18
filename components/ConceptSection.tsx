"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { development, t as tDev } from "@/data/development";
import SectionHeader from "./SectionHeader";

export default function ConceptSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <section id="concepto" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow={t("concept.eyebrow")}
              heading={tDev.text(development.concept.heading, locale)}
            />
            <p className="mt-8 text-lg leading-relaxed text-ink/75 whitespace-pre-line">
              {tDev.text(development.concept.body, locale)}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
              <Image
                src={development.galleryImages[0] || development.heroImages[0]}
                alt={development.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 border-t border-ink/10 pt-16">
          {development.concept.highlights.map((h, i) => (
            <div key={i}>
              <p className="text-eyebrow text-primary mb-3">{tDev.text(h.label, locale)}</p>
              <p className="text-base leading-snug text-ink/80">{tDev.text(h.body, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
