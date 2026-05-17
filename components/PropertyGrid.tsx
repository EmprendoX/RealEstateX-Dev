import React from "react";
import { Property } from "@/data/properties";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          No encontramos propiedades con esos filtros.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Intenta ajustar tus criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}


