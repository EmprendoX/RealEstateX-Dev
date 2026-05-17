import React from "react";
import { Property } from "@/data/properties";

interface PropertyMapProps {
  property: Property;
}

export default function PropertyMap({ property }: PropertyMapProps) {
  const query = encodeURIComponent(`${property.location}, ${property.city}`);
  // Google Maps embed sin API key: muestra la dirección con pin.
  // Limitación: si la dirección es ambigua puede caer en el lugar equivocado.
  // Para precisión exacta habría que agregar lat/lng a Property.
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6 md:p-8 pb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Ubicación</h2>
          <a
            href={openInMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            Ver en Google Maps →
          </a>
        </div>
        <p className="text-gray-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}, {property.city}
        </p>
      </div>
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${property.title}`}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
