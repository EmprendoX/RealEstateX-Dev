import fs from "fs";
import path from "path";
import { SiteConfig } from "@/config/siteConfig";
import { Property } from "@/data/properties";

const CONFIG_PATH = path.join(process.cwd(), "config", "siteConfig.ts");
const PROPERTIES_PATH = path.join(process.cwd(), "data", "properties.ts");

/**
 * Genera el contenido del archivo siteConfig.ts
 */
function generateSiteConfigFile(config: SiteConfig): string {
  return `/**
 * CONFIGURACIÓN CENTRAL DEL SITIO
 * 
 * Este archivo contiene toda la configuración que necesita ser personalizada
 * para cada broker. Para duplicar el sitio para otro broker, solo necesitas
 * cambiar los valores en este archivo.
 */

export interface SiteConfig {
  // Información del sitio
  siteName: string;
  siteUrl: string; // URL absoluta del sitio en producción (ej: "https://juanperez.com") sin barra final
  logoText: string;
  logoUrl?: string; // URL de la imagen del logo (opcional)
  primaryColor: string; // Color principal en formato hex (ej: "#0EA5E9")
  secondaryColor: string; // Color secundario en formato hex (ej: "#06B6D4")
  
  // Datos del broker
  brokerName: string;
  phone: string;
  whatsapp: string; // Número sin espacios ni caracteres especiales (ej: "5215512345678")
  email: string;
  city: string;
  address: string;
  slogan: string;
  
  // Redes sociales (opcionales)
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
  
  // Hooks para automatización (opcionales)
  leadWebhookUrl?: string; // URL del webhook para enviar leads (Make, Zapier, etc.)
  chatScript?: string; // HTML/JS del widget de chat (Crisp, Intercom, Tidio, etc.)
}

export const siteConfig: SiteConfig = {
  // ============================================
  // INFORMACIÓN DEL SITIO
  // ============================================
  siteName: ${JSON.stringify(config.siteName)},
  siteUrl: ${JSON.stringify(config.siteUrl)},
  logoText: ${JSON.stringify(config.logoText)},
  logoUrl: ${config.logoUrl ? JSON.stringify(config.logoUrl) : "undefined"},
  primaryColor: ${JSON.stringify(config.primaryColor)},
  secondaryColor: ${JSON.stringify(config.secondaryColor)},
  
  // ============================================
  // DATOS DEL BROKER
  // ============================================
  brokerName: ${JSON.stringify(config.brokerName)},
  phone: ${JSON.stringify(config.phone)},
  whatsapp: ${JSON.stringify(config.whatsapp)},
  email: ${JSON.stringify(config.email)},
  city: ${JSON.stringify(config.city)},
  address: ${JSON.stringify(config.address)},
  slogan: ${JSON.stringify(config.slogan)},
  
  // ============================================
  // REDES SOCIALES
  // ============================================
  facebook: ${config.facebook ? JSON.stringify(config.facebook) : "undefined"},
  instagram: ${config.instagram ? JSON.stringify(config.instagram) : "undefined"},
  tiktok: ${config.tiktok ? JSON.stringify(config.tiktok) : "undefined"},
  linkedin: ${config.linkedin ? JSON.stringify(config.linkedin) : "undefined"},
  website: ${config.website ? JSON.stringify(config.website) : "undefined"},
  
  // ============================================
  // AUTOMATIZACIONES
  // ============================================
  leadWebhookUrl: ${config.leadWebhookUrl ? JSON.stringify(config.leadWebhookUrl) : "undefined"},
  chatScript: ${config.chatScript ? JSON.stringify(config.chatScript) : "undefined"},
};
`;
}

/**
 * Genera el contenido del archivo properties.ts
 */
function generatePropertiesFile(properties: Property[]): string {
  const propertiesString = properties
    .map((prop) => {
      return `  {
    id: ${JSON.stringify(prop.id)},
    slug: ${JSON.stringify(prop.slug)},
    title: ${JSON.stringify(prop.title)},
    description: ${JSON.stringify(prop.description)},
    type: ${JSON.stringify(prop.type)},
    price: ${prop.price},
    currency: ${JSON.stringify(prop.currency)},
    location: ${JSON.stringify(prop.location)},
    city: ${JSON.stringify(prop.city)},
    bedrooms: ${prop.bedrooms},
    bathrooms: ${prop.bathrooms},
    parking: ${prop.parking},
    area: ${prop.area},
    ${prop.featured !== undefined ? `featured: ${prop.featured},` : ""}
    images: [${prop.images.map((img) => JSON.stringify(img)).join(", ")}],${prop.tourUrl ? `\n    tourUrl: ${JSON.stringify(prop.tourUrl)},` : ""}
  }`;
    })
    .join(",\n");

  return `/**
 * DATOS DE PROPIEDADES
 * 
 * Este archivo contiene el tipo Property y el array de propiedades.
 * Para agregar o modificar propiedades, edita el array 'properties' abajo.
 */

export const MAX_PROPERTIES = 50;

export type PropertyType = "venta" | "renta";
export type Currency = "MXN" | "USD";

export interface Property {
  id: string;
  slug: string; // URL amigable (ej: "departamento-reforma-123")
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  currency: Currency;
  location: string; // Dirección o colonia
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number; // Área en m²
  featured?: boolean; // Si es true, aparecerá en la sección destacada del home
  images: string[]; // URLs de las imágenes
  tourUrl?: string; // URL opcional de tour virtual (Matterport, YouTube, Vimeo, etc.)
}

export const properties: Property[] = [
${propertiesString}
];

/**
 * Función helper para obtener una propiedad por slug
 */
export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

/**
 * Función helper para obtener propiedades destacadas
 */
export function getFeaturedProperties(): Property[] {
  return properties.filter((property) => property.featured === true);
}

/**
 * Función helper para obtener ciudades únicas de las propiedades
 */
export function getUniqueCities(): string[] {
  const cities = properties.map((property) => property.city);
  return Array.from(new Set(cities));
}
`;
}

/**
 * Escribe la configuración del sitio en el archivo
 */
export function writeSiteConfig(config: SiteConfig): void {
  try {
    const content = generateSiteConfigFile(config);
    fs.writeFileSync(CONFIG_PATH, content, "utf-8");
  } catch (error) {
    console.error("Error escribiendo siteConfig:", error);
    throw new Error("Error al guardar la configuración");
  }
}

/**
 * Escribe las propiedades en el archivo
 */
export function writeProperties(properties: Property[]): void {
  try {
    const content = generatePropertiesFile(properties);
    fs.writeFileSync(PROPERTIES_PATH, content, "utf-8");
  } catch (error) {
    console.error("Error escribiendo properties:", error);
    throw new Error("Error al guardar las propiedades");
  }
}


