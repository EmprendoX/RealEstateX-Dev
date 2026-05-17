"use client";

import React, { useState } from "react";

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export default function ContactForm({
  propertyId,
  propertyTitle,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Validación básica
    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus("error");
      setErrorMessage("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Por favor ingresa un email válido.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId: propertyId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente o contáctanos directamente."
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      {propertyTitle && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-sm text-gray-600">Interesado en:</p>
          <p className="font-semibold text-primary">{propertyTitle}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ¿Te interesa esta propiedad?
      </h2>
      <p className="text-gray-600 mb-6">
        Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+52 55 1234 5678"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Cuéntanos qué te interesa de esta propiedad..."
          />
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}


