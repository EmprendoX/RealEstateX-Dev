import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import PropertyHero from "@/components/PropertyHero";
import PropertyMap from "@/components/PropertyMap";
import PropertyTour from "@/components/PropertyTour";
import MortgageCalculator from "@/components/MortgageCalculator";
import ContactForm from "@/components/ContactForm";
import { properties, getPropertyBySlug, Property } from "@/data/properties";
import { siteConfig } from "@/config/siteConfig";

interface PropertyDetailPageProps {
  property: Property;
}

export default function PropertyDetailPage({ property }: PropertyDetailPageProps) {
  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa la propiedad: ${property.title}. ¿Me puedes dar más información?`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const canonicalPath = `/properties/${property.slug}`;
  const absoluteImages = property.images.map((img) =>
    /^https?:\/\//i.test(img) ? img : `${baseUrl}${img.startsWith("/") ? img : `/${img}`}`
  );

  // Schema.org: RealEstateListing es el tipo más específico y reconocido por Google
  // para anuncios inmobiliarios; mejora rich results y matching de intent.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${baseUrl}${canonicalPath}`,
    image: absoluteImages,
    datePosted: new Date().toISOString().split("T")[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location,
      addressLocality: property.city,
      addressCountry: "MX",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability: "https://schema.org/InStock",
      businessFunction:
        property.type === "venta"
          ? "https://schema.org/Sell"
          : "https://schema.org/LeaseOut",
    },
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "MTK",
    },
    broker: {
      "@type": "RealEstateAgent",
      name: siteConfig.brokerName,
      telephone: siteConfig.phone,
      email: siteConfig.email,
    },
  };

  const metaDescription =
    property.description.length > 160
      ? `${property.description.substring(0, 157)}...`
      : property.description;

  return (
    <Layout
      title={property.title}
      description={metaDescription}
      image={property.images[0]}
      canonicalPath={canonicalPath}
      jsonLd={jsonLd}
    >
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-primary">
                Propiedades
              </Link>
              <span>/</span>
              <span className="text-gray-900">{property.title}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal - Información de la propiedad */}
            <div className="lg:col-span-2">
              <PropertyHero property={property} />

              {/* Descripción completa */}
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Descripción
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Ficha técnica */}
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Ficha técnica
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipo</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {property.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recámaras</p>
                    <p className="font-semibold text-gray-900">
                      {property.bedrooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Baños</p>
                    <p className="font-semibold text-gray-900">
                      {property.bathrooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Estacionamientos
                    </p>
                    <p className="font-semibold text-gray-900">
                      {property.parking}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Área</p>
                    <p className="font-semibold text-gray-900">
                      {property.area} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                    <p className="font-semibold text-gray-900">
                      {property.location}, {property.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tour virtual (si la propiedad lo tiene) */}
              {property.tourUrl && <PropertyTour url={property.tourUrl} />}

              {/* Mapa con ubicación */}
              <PropertyMap property={property} />

              {/* Calculadora de hipoteca (solo en propiedades en venta) */}
              {property.type === "venta" && (
                <MortgageCalculator property={property} />
              )}

              {/* Descargar PDF */}
              <div className="bg-white rounded-lg shadow-md p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">Ficha de la propiedad</h3>
                  <p className="text-sm text-gray-600">
                    Descargá un PDF con toda la información para imprimir o compartir.
                  </p>
                </div>
                <a
                  href={`/api/properties/${property.slug}/pdf`}
                  download={`${property.slug}.pdf`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar PDF
                </a>
              </div>

              {/* Botón WhatsApp destacado */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Tienes preguntas sobre esta propiedad?
                </h3>
                <p className="text-gray-600 mb-4">
                  Contáctanos directamente por WhatsApp para una respuesta rápida
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  💬 Contactar por WhatsApp
                </a>
              </div>
            </div>

            {/* Columna lateral - Formulario de contacto */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ContactForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: properties.map((p) => ({ params: { slug: p.slug } })),
    // blocking: si se agrega una propiedad desde el admin y aún no fue rebuildeada,
    // Next la renderiza on-demand en lugar de devolver 404.
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PropertyDetailPageProps> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (typeof slug !== "string") {
    return { notFound: true };
  }

  const property = getPropertyBySlug(slug);
  if (!property) {
    return { notFound: true };
  }

  return {
    props: { property },
    // Revalida cada 60s para reflejar cambios del admin sin redeploy
    revalidate: 60,
  };
};
