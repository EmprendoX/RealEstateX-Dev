"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useTranslation } from "next-i18next";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/formatPrice";
import FavoriteButton from "./FavoriteButton";

interface PropertyHeroProps {
  property: Property;
}

export default function PropertyHero({ property }: PropertyHeroProps) {
  const { t } = useTranslation("common");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainImage = property.images[selectedImageIndex] || property.images[0];
  const slides = property.images.map((src) => ({ src }));

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      {/* Main image — click to open lightbox */}
      <button
        type="button"
        onClick={() => openLightbox(selectedImageIndex)}
        aria-label={t("propertyHero.viewFullscreen")}
        className="relative h-96 md:h-[500px] w-full mb-4 rounded-lg overflow-hidden block group cursor-zoom-in"
      >
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover transition-transform group-hover:scale-[1.02]"
          priority
          sizes="100vw"
        />
        {/* Type badge */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <span
            className={`px-4 py-2 rounded-full text-lg font-semibold ${
              property.type === "venta"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {property.type === "venta" ? t("propertyHero.forSale") : t("propertyHero.forRent")}
          </span>
        </div>
        {/* Photo count indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium pointer-events-none flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t("propertyHero.photosCount", { count: property.images.length })}
          </div>
        )}
      </button>

      {/* Thumbnails */}
      {property.images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              onDoubleClick={() => openLightbox(index)}
              className={`relative h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? "border-primary ring-2 ring-primary"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <Image
                src={image}
                alt={t("propertyHero.imageAlt", { title: property.title, index: index + 1 })}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox fullscreen */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={selectedImageIndex}
        on={{ view: ({ index }) => setSelectedImageIndex(index) }}
        controller={{ closeOnBackdropClick: true }}
      />

      {/* Main info */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {property.title}
          </h1>
          <div className="flex-shrink-0 pt-1">
            <FavoriteButton propertyId={property.id} />
          </div>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          📍 {property.location}, {property.city}
        </p>

        {/* Highlighted price */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">{t("propertyHero.price")}</p>
          <p className="text-4xl font-bold text-primary">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>

        {/* Key features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl mb-1">🛏️</p>
            <p className="text-sm text-gray-600">{t("propertyHero.bedrooms")}</p>
            <p className="text-xl font-bold text-gray-900">
              {property.bedrooms}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl mb-1">🚿</p>
            <p className="text-sm text-gray-600">{t("propertyHero.bathrooms")}</p>
            <p className="text-xl font-bold text-gray-900">
              {property.bathrooms}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl mb-1">🚗</p>
            <p className="text-sm text-gray-600">{t("propertyHero.parking")}</p>
            <p className="text-xl font-bold text-gray-900">
              {property.parking}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl mb-1">📐</p>
            <p className="text-sm text-gray-600">{t("propertyHero.area")}</p>
            <p className="text-xl font-bold text-gray-900">
              {property.area} m²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
