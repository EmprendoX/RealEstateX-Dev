import React from "react";
import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/config/siteConfig";

export default function ContactPage() {
  const whatsappMessage = encodeURIComponent(
    "Hola, me gustaría obtener más información sobre tus servicios inmobiliarios."
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  return (
    <Layout
      title="Contacto"
      description={`Contacta con ${siteConfig.brokerName} para encontrar tu propiedad ideal en ${siteConfig.city}`}
      canonicalPath="/contact"
    >
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600">
              Estamos aquí para ayudarte a encontrar tu propiedad ideal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Formulario */}
            <div>
              <ContactForm />
            </div>

            {/* Columna derecha - Información de contacto */}
            <div className="space-y-6">
              {/* Información de contacto destacada */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Información de contacto
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📞</div>
                    <div>
                      <p className="font-semibold text-gray-900">Teléfono</p>
                      <a
                        href={`tel:${siteConfig.phone}`}
                        className="text-primary hover:underline"
                      >
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">✉️</div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-primary hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Enviar mensaje
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <p className="font-semibold text-gray-900">Ubicación</p>
                      <p className="text-gray-700">{siteConfig.address}</p>
                      <p className="text-gray-700">{siteConfig.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios de atención */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Horarios de atención
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Lunes a Viernes:</strong> 9:00 AM - 7:00 PM
                  </p>
                  <p>
                    <strong>Sábados:</strong> 10:00 AM - 4:00 PM
                  </p>
                  <p>
                    <strong>Domingos:</strong> Solo citas programadas
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  También puedes contactarnos por WhatsApp en cualquier momento.
                  Responderemos lo antes posible.
                </p>
              </div>

              {/* Botón WhatsApp destacado */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Prefieres WhatsApp?
                </h3>
                <p className="text-gray-600 mb-4">
                  Contáctanos directamente por WhatsApp para una respuesta rápida
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  💬 Abrir WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Mapa placeholder */}
          <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold mb-2">Mapa</p>
                <p className="text-sm">
                  {siteConfig.address}, {siteConfig.city}
                </p>
                <p className="text-xs mt-2">
                  (Integra Google Maps aquí si lo deseas)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


