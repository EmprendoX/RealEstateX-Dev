"use client";

import React, { useState } from "react";
import { Property, PropertyType, Currency } from "@/data/properties";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: Property) => Promise<void>;
  onCancel?: () => void;
}

export default function PropertyForm({
  property,
  onSubmit,
  onCancel,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<Property>(
    property || {
      id: "",
      slug: "",
      title: "",
      description: "",
      type: "venta",
      price: 0,
      currency: "MXN",
      location: "",
      city: "",
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      area: 0,
      featured: false,
      images: [],
      tourUrl: "",
    }
  );
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)");
      return;
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 10MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
        // Limpiar input
        e.target.value = "";
      } else {
        setError(data.message || "Error al subir la imagen");
      }
    } catch (error) {
      setError("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (!formData.id || !formData.slug || !formData.title) {
      setError("ID, Slug y Título son requeridos");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("Debes agregar al menos una imagen");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError("Error al guardar la propiedad");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información Básica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID * (único)
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug * (URL amigable, único)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="departamento-lujo-polanco"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Tipo y Precio */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tipo y Precio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda *
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección/Colonia *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Características
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recámaras *
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baños *
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estacionamientos *
            </label>
            <input
              type="number"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área (m²) *
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">
              Propiedad destacada
            </span>
          </label>
        </div>
      </div>

      {/* Tour virtual */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Tour virtual <span className="text-sm font-normal text-gray-500">(opcional)</span>
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Pegá una URL de YouTube, Vimeo, Matterport u otro proveedor de tour 360°.
          Se mostrará embebido en el detalle de la propiedad.
        </p>
        <input
          type="url"
          name="tourUrl"
          value={formData.tourUrl || ""}
          onChange={handleChange}
          placeholder="https://my.matterport.com/show/?m=XXXX  o  https://youtu.be/XXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Imágenes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Imágenes</h2>
        <div className="space-y-4">
          {/* Opción 1: Subir archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subir imagen desde tu computadora
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 disabled:opacity-50"
              />
              {uploadingImage && (
                <span className="flex items-center text-sm text-gray-600">
                  Subiendo...
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatos permitidos: JPG, PNG, WEBP, GIF. Tamaño máximo: 10MB
            </p>
          </div>

          {/* Opción 2: Agregar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O agregar imagen desde URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Agregar URL
              </button>
            </div>
          </div>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : property ? "Actualizar" : "Crear"} Propiedad
        </button>
      </div>
    </form>
  );
}

