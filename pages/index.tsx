import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import PropertyGrid from "@/components/PropertyGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import { siteConfig } from "@/config/siteConfig";
import { properties, getFeaturedProperties, getUniqueCities, PropertyType } from "@/data/properties";
import { getTestimonials } from "@/data/testimonials";
import { aboutContent, renderTemplate } from "@/data/aboutPage";

export default function Home() {
  const [selectedType, setSelectedType] = useState<PropertyType | "all">("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const featuredProperties = getFeaturedProperties();
  const cities = getUniqueCities();
  const testimonials = getTestimonials();
  const tplVars = { city: siteConfig.city, brokerName: siteConfig.brokerName };
  const whatsappMessage = encodeURIComponent(
    "Hola, me interesa una propiedad. ¿Me puedes dar más información?"
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  // Filtrar propiedades cuando cambian los filtros
  useEffect(() => {
    let filtered = properties;

    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }

    setFilteredProperties(filtered);
  }, [selectedType, selectedCity]);

  return (
    <Layout
      title="Inicio"
      description={`Encuentra tu propiedad ideal en ${siteConfig.city}. ${siteConfig.slogan}`}
      canonicalPath="/"
      image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"
    >
      {/* Hero Principal */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
            alt="Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {siteConfig.siteName}
          </h1>
          <p className="text-xl md:text-2xl mb-2">{siteConfig.slogan}</p>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            En {siteConfig.city}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Ver propiedades
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Buscador Simple */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Busca tu propiedad ideal
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de operación
                </label>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as PropertyType | "all")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="venta">Venta</option>
                  <option value="renta">Renta</option>
                </select>
              </div>

              {/* Filtro por ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Todas</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filteredProperties.length > 0 && (
              <div className="mt-6 text-center">
                <Link
                  href="/properties"
                  className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Ver {filteredProperties.length} propiedades
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Propiedades Destacadas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Propiedades destacadas
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Las mejores opciones para ti
          </p>
          {featuredProperties.length > 0 ? (
            <PropertyGrid properties={featuredProperties.slice(0, 3)} />
          ) : (
            <PropertyGrid properties={properties.slice(0, 3)} />
          )}
          <div className="text-center mt-8">
            <Link
              href="/properties"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver todas las propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre mí / Sobre nosotros */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {renderTemplate(aboutContent.homeIntro.heading, tplVars)}
              </h2>
              {aboutContent.homeIntro.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-600 mb-4">
                  {renderTemplate(p, tplVars)}
                </p>
              ))}
              <Link
                href="/about"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-2"
              >
                Conocer más
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={aboutContent.brokerPhoto}
                alt={siteConfig.brokerName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      {/* CTA Final */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para encontrar tu propiedad ideal?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Agenda una llamada o pide una valoración gratuita de tu propiedad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Contactar ahora
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

