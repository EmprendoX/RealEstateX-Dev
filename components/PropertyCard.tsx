import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/formatPrice";
import FavoriteButton from "./FavoriteButton";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || "/images/placeholder.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen */}
      <div className="relative h-64 w-full">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge de tipo */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              property.type === "venta"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {property.type === "venta" ? "Venta" : "Renta"}
          </span>
        </div>
        {property.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ Destacada
            </span>
          </div>
        )}
        {/* Botón de favorito */}
        <div className="absolute bottom-4 right-4">
          <FavoriteButton propertyId={property.id} />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          📍 {property.location}, {property.city}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>

        {/* Características */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            🛏️ {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            🚿 {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            🚗 {property.parking}
          </span>
          <span className="flex items-center gap-1">
            📐 {property.area} m²
          </span>
        </div>

        {/* Botón */}
        <Link
          href={`/properties/${property.slug}`}
          className="block w-full bg-primary hover:bg-primary/90 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}


