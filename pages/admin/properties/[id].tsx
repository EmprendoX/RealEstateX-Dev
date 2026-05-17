"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property } from "@/data/properties";

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      const response = await fetch("/api/admin/properties");
      const data = await response.json();
      if (data.ok && data.properties) {
        const found = data.properties.find((p: Property) => p.id === propertyId);
        if (found) {
          setProperty(found);
        } else {
          alert("Propiedad no encontrada");
          router.push("/admin/properties");
        }
      }
    } catch (error) {
      console.error("Error cargando propiedad:", error);
      alert("Error al cargar la propiedad");
      router.push("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedProperty: Property) => {
    const response = await fetch(`/api/admin/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProperty),
    });

    const data = await response.json();

    if (data.ok) {
      alert("Propiedad actualizada exitosamente");
      router.push("/admin/properties");
    } else {
      throw new Error(data.message || "Error al actualizar la propiedad");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Editar Propiedad
        </h1>
        <p className="text-gray-600 mb-8">
          Modifica los datos de la propiedad.
        </p>
        <PropertyForm
          property={property}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/properties")}
        />
      </div>
    </AdminLayout>
  );
}


