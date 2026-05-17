"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";
import { SiteConfig } from "@/config/siteConfig";

export default function ConfigForm() {
  const [formData, setFormData] = useState<SiteConfig>(siteConfig);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cargar configuración actual
    setFormData(siteConfig);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload(); // Recargar para ver cambios
        }, 1500);
      } else {
        setError(data.message || "Error al guardar la configuración");
        setLoading(false);
      }
    } catch (error) {
      setError("Error al guardar la configuración");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Sitio */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información del Sitio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Sitio *
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Sitio *
            </label>
            <input
              type="url"
              name="siteUrl"
              value={formData.siteUrl}
              onChange={handleChange}
              required
              placeholder="https://juanperez.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL absoluta sin barra final. Se usa en sitemap y SEO.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto del Logo *
            </label>
            <input
              type="text"
              name="logoText"
              value={formData.logoText}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Logo (opcional)
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Primario * (hex)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))
                }
                className="h-10 w-20 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                required
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Secundario * (hex)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, secondaryColor: e.target.value }))
                }
                className="h-10 w-20 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                required
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Datos del Broker */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Datos del Broker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Broker *
            </label>
            <input
              type="text"
              name="brokerName"
              value={formData.brokerName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp * (sin + ni espacios)
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="5215512345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slogan *
            </label>
            <input
              type="text"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Redes Sociales (opcional)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://facebook.com/tu-pagina"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://instagram.com/tu-cuenta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TikTok
            </label>
            <input
              type="url"
              name="tiktok"
              value={formData.tiktok || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://tiktok.com/@tu-cuenta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://linkedin.com/in/tu-perfil"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio Web
            </label>
            <input
              type="url"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://tu-sitio.com"
            />
          </div>
        </div>
      </div>

      {/* Automatizaciones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Automatizaciones (opcional)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Webhook para Leads
            </label>
            <input
              type="url"
              name="leadWebhookUrl"
              value={formData.leadWebhookUrl || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="https://hook.make.com/tu-webhook-id"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL del webhook para enviar leads automáticamente (Make, Zapier, etc.)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Script de Chat
            </label>
            <textarea
              name="chatScript"
              value={formData.chatScript || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary font-mono text-sm"
              placeholder='<script type="text/javascript">window.$crisp=[];...</script>'
            />
            <p className="mt-1 text-sm text-gray-500">
              Script HTML/JS del widget de chat (Crisp, Intercom, Tidio, etc.)
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          Configuración guardada exitosamente. Recargando...
        </div>
      )}

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </form>
  );
}


