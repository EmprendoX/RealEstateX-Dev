/**
 * Generadores de archivos para el setup-broker.
 * Extraídos en su propio módulo para poder ser testeados sin pasar
 * por el flujo interactivo de prompts.
 */

export interface BrokerInput {
  siteName: string;
  siteUrl: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  brokerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  slogan: string;
  facebook?: string;
  instagram?: string;
  leadWebhookUrl?: string;
}

const opt = (v: string | undefined): string =>
  v && v.trim() ? JSON.stringify(v.trim()) : "undefined";

export function genSiteConfig(b: BrokerInput): string {
  return `/**
 * CONFIGURACIÓN CENTRAL DEL SITIO
 *
 * Este archivo contiene toda la configuración que necesita ser personalizada
 * para cada broker. Para duplicar el sitio para otro broker, solo necesitas
 * cambiar los valores en este archivo.
 */

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  logoText: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;

  brokerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
  slogan: string;

  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;

  leadWebhookUrl?: string;
  chatScript?: string;
}

export const siteConfig: SiteConfig = {
  siteName: ${JSON.stringify(b.siteName.trim())},
  siteUrl: ${JSON.stringify(b.siteUrl.trim().replace(/\/$/, ""))},
  logoText: ${JSON.stringify((b.logoText || b.siteName).trim())},
  logoUrl: undefined,
  primaryColor: ${JSON.stringify(b.primaryColor.trim())},
  secondaryColor: ${JSON.stringify(b.secondaryColor.trim())},

  brokerName: ${JSON.stringify(b.brokerName.trim())},
  phone: ${JSON.stringify(b.phone.trim())},
  whatsapp: ${JSON.stringify(b.whatsapp.trim())},
  email: ${JSON.stringify(b.email.trim())},
  city: ${JSON.stringify(b.city.trim())},
  address: ${JSON.stringify(b.address.trim())},
  slogan: ${JSON.stringify(b.slogan.trim())},

  facebook: ${opt(b.facebook)},
  instagram: ${opt(b.instagram)},
  tiktok: undefined,
  linkedin: undefined,
  website: undefined,

  leadWebhookUrl: ${opt(b.leadWebhookUrl)},
  chatScript: undefined,
};
`;
}

export function genEmptyProperties(): string {
  return `/**
 * DATOS DE PROPIEDADES
 *
 * Edita el array 'properties' o usa el panel de administración en /admin.
 */

export const MAX_PROPERTIES = 50;

export type PropertyType = "venta" | "renta";
export type Currency = "MXN" | "USD";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  currency: Currency;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  featured?: boolean;
  images: string[];
  tourUrl?: string;
}

export const properties: Property[] = [];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((property) => property.featured === true);
}

export function getUniqueCities(): string[] {
  const cities = properties.map((property) => property.city);
  return Array.from(new Set(cities));
}
`;
}

export function genPlaceholderTestimonials(): string {
  return `/**
 * TESTIMONIOS DE CLIENTES
 *
 * REEMPLAZAR estos placeholders con testimonios reales antes de publicar.
 * Si no hay testimonios todavía, vacía el array y la sección no se muestra.
 */

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number;
  role?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "PENDIENTE",
    text: "Pendiente — reemplazar con testimonio real de cliente.",
    rating: 5,
  },
  {
    id: "2",
    author: "PENDIENTE",
    text: "Pendiente — reemplazar con testimonio real de cliente.",
    rating: 5,
  },
  {
    id: "3",
    author: "PENDIENTE",
    text: "Pendiente — reemplazar con testimonio real de cliente.",
    rating: 5,
  },
];

export function getTestimonials(limit?: number): Testimonial[] {
  return limit ? testimonials.slice(0, limit) : testimonials;
}
`;
}

export function genResetAboutPage(): string {
  return `/**
 * CONTENIDO DE PÁGINA "SOBRE MÍ" Y SECCIÓN INTRO DEL HOME
 *
 * Variables de plantilla disponibles en los textos:
 *   {{city}}       → siteConfig.city
 *   {{brokerName}} → siteConfig.brokerName
 *
 * REEMPLAZAR la foto del broker (brokerPhoto) con una foto real
 * antes de publicar.
 */

export interface AboutContent {
  brokerPhoto: string;
  role: string;
  homeIntro: {
    heading: string;
    paragraphs: string[];
  };
  bio: {
    heading: string;
    paragraphs: string[];
  };
  howIWork: {
    heading: string;
    intro: string;
    pillars: { title: string; description: string }[];
    outro?: string;
  };
  whyMe: {
    heading: string;
    items: { title: string; description: string }[];
  };
}

export const aboutContent: AboutContent = {
  brokerPhoto:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  role: "Broker Inmobiliario",

  homeIntro: {
    heading: "Tu asesor inmobiliario en {{city}}",
    paragraphs: [
      "Con años de experiencia en el mercado inmobiliario, me especializo en ayudar a personas y familias a encontrar su hogar ideal. Mi compromiso es brindarte un servicio personalizado y profesional que supere tus expectativas.",
      "Trabajo con las mejores propiedades en {{city}}, desde departamentos modernos hasta casas familiares, siempre buscando la mejor opción para cada cliente.",
      "Mi objetivo es hacer que el proceso de compra o renta de tu propiedad sea sencillo, transparente y exitoso.",
    ],
  },

  bio: {
    heading: "Quién soy",
    paragraphs: [
      "Soy {{brokerName}}, un profesional del sector inmobiliario con años de experiencia ayudando a personas y familias a encontrar su hogar ideal en {{city}}. Mi pasión por el sector inmobiliario comenzó cuando me di cuenta de lo importante que es encontrar el lugar perfecto para vivir.",
      "Mi objetivo es brindar un servicio personalizado, transparente y profesional que supere las expectativas de cada cliente. Trabajo con dedicación para entender tus necesidades y encontrar la propiedad que mejor se adapte a tu estilo de vida y presupuesto.",
    ],
  },

  howIWork: {
    heading: "Cómo trabajo",
    intro: "Mi metodología se basa en tres pilares fundamentales:",
    pillars: [
      {
        title: "Escucha activa",
        description:
          "Me tomo el tiempo necesario para entender tus necesidades, deseos y presupuesto.",
      },
      {
        title: "Selección cuidadosa",
        description:
          "Te presento solo las propiedades que realmente cumplen con tus criterios, ahorrándote tiempo y esfuerzo.",
      },
      {
        title: "Acompañamiento completo",
        description:
          "Te guío en cada paso del proceso, desde la búsqueda hasta la firma de documentos.",
      },
    ],
    outro:
      "Trabajo con las mejores propiedades disponibles en el mercado, desde departamentos modernos hasta casas familiares, siempre buscando la mejor opción para cada cliente.",
  },

  whyMe: {
    heading: "Por qué trabajar conmigo",
    items: [
      {
        title: "Experiencia comprobada",
        description:
          "Años de experiencia en el mercado inmobiliario de {{city}}.",
      },
      {
        title: "Atención personalizada",
        description: "Cada cliente es único y merece un servicio a su medida.",
      },
      {
        title: "Transparencia total",
        description: "Información clara y honesta en cada paso del proceso.",
      },
      {
        title: "Compromiso con resultados",
        description:
          "Trabajo incansablemente hasta encontrar tu propiedad ideal.",
      },
    ],
  },
};

export function renderTemplate(
  text: string,
  vars: { city: string; brokerName: string }
): string {
  return text
    .replace(/\\{\\{city\\}\\}/g, vars.city)
    .replace(/\\{\\{brokerName\\}\\}/g, vars.brokerName);
}
`;
}
