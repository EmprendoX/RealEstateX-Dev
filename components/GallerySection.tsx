"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { development } from "@/data/development";
import SectionHeader from "./SectionHeader";

// Editorial 6-slot layout — one wide feature + 5 supporting tiles.
// Falls back to a plain grid when there are fewer than 6 images.
export default function GallerySection() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const images = development.galleryImages;

  if (!images || images.length === 0) return null;

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <section id="galeria" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("gallery.eyebrow")}
          heading={t("gallery.heading")}
          intro={t("gallery.intro")}
        />

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-6 auto-rows-[220px] md:auto-rows-[280px] gap-3 md:gap-4">
          {images.slice(0, 6).map((src, i) => {
            // Layout: [1 spans 3x2] [2 3x1] [3 3x1] [4 2x1] [5 2x1] [6 2x1]
            const layout = [
              "col-span-2 row-span-2 lg:col-span-3 lg:row-span-2",
              "col-span-2 lg:col-span-3",
              "col-span-2 lg:col-span-3",
              "col-span-2 lg:col-span-2",
              "col-span-2 lg:col-span-2",
              "col-span-2 lg:col-span-2",
            ][i];
            return (
              <button
                key={src}
                type="button"
                onClick={() => openAt(i)}
                className={`group relative overflow-hidden bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary ${layout}`}
                aria-label={t("gallery.openImage", { n: i + 1 })}
              >
                <Image
                  src={src}
                  alt={`${development.name} — ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />
                <span className="absolute bottom-3 right-3 text-xs uppercase tracking-eyebrow text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t("gallery.view")}
                </span>
              </button>
            );
          })}
        </div>

        {images.length > 6 && (
          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={() => openAt(0)}
              className="text-xs uppercase tracking-eyebrow text-ink/70 hover:text-primary transition-colors"
            >
              {t("gallery.viewAll", { count: images.length })} →
            </button>
          </div>
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(10, 10, 10, 0.94)" } }}
      />
    </section>
  );
}
