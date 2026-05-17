"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import PropertyList from "@/components/admin/PropertyList";
import { Property, MAX_PROPERTIES } from "@/data/properties";

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties");
      const data = await response.json();
      if (data.ok) {
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Error cargando propiedades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.ok) {
        setProperties(properties.filter((p) => p.id !== id));
        alert("Propiedad eliminada exitosamente");
      } else {
        alert(data.message || "Error al eliminar la propiedad");
      }
    } catch (error) {
      console.error("Error eliminando propiedad:", error);
      alert("Error al eliminar la propiedad");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Propiedades
            </h1>
            <p className="text-gray-600 mt-2">
              {properties.length} / {MAX_PROPERTIES} propiedades
            </p>
          </div>
          {properties.length < MAX_PROPERTIES ? (
            <Link
              href="/admin/properties/new"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              + Crear Propiedad
            </Link>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm">
              Límite alcanzado ({MAX_PROPERTIES} propiedades)
            </div>
          )}
        </div>

        {properties.length >= MAX_PROPERTIES && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Has alcanzado el límite máximo de {MAX_PROPERTIES} propiedades.
                  Elimina una propiedad existente para crear una nueva.
                </p>
              </div>
            </div>
          </div>
        )}

        <PropertyList properties={properties} onDelete={handleDelete} />
      </div>
    </AdminLayout>
  );
}


