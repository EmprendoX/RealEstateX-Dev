"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property, MAX_PROPERTIES } from "@/data/properties";

export default function NewPropertyPage() {
  const router = useRouter();
  const [propertiesCount, setPropertiesCount] = useState(0);

  useEffect(() => {
    // Verificar límite
    fetch("/api/admin/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setPropertiesCount(data.count || 0);
          if (data.count >= MAX_PROPERTIES) {
            alert(
              `No se pueden agregar más de ${MAX_PROPERTIES} propiedades. Elimina una existente primero.`
            );
            router.push("/admin/properties");
          }
        }
      });
  }, [router]);

  const handleSubmit = async (property: Property) => {
    const response = await fetch("/api/admin/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(property),
    });

    const data = await response.json();

    if (data.ok) {
      alert("Propiedad creada exitosamente");
      router.push("/admin/properties");
    } else {
      throw new Error(data.message || "Error al crear la propiedad");
    }
  };

  if (propertiesCount >= MAX_PROPERTIES) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">
            Has alcanzado el límite máximo de {MAX_PROPERTIES} propiedades.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Crear Nueva Propiedad
        </h1>
        <p className="text-gray-600 mb-8">
          Completa el formulario para agregar una nueva propiedad. Recuerda que
          el límite máximo es de {MAX_PROPERTIES} propiedades ({propertiesCount} / {MAX_PROPERTIES}).
        </p>
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/properties")}
        />
      </div>
    </AdminLayout>
  );
}


