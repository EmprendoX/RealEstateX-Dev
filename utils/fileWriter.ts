import fs from "fs";
import path from "path";
import { SiteConfig } from "@/config/siteConfig";
import { Property } from "@/data/properties";

const CONFIG_PATH = path.join(process.cwd(), "config", "siteConfig.ts");
const PROPERTIES_PATH = path.join(process.cwd(), "data", "properties.ts");

/**
 * Generates the contents of the siteConfig.ts file.
 */
function generateSiteConfigFile(config: SiteConfig): string {
  return `/**
 * CENTRAL SITE CONFIGURATION
 *
 * This file contains all the configuration that needs to be customized
 * for each broker. To duplicate the site for another broker, you only need
 * to change the values in this file.
 */

export interface SiteConfig {
  // Site information
  siteName: string;
  siteUrl: string; // Absolute production URL (e.g. "https://juanperez.com") with no trailing slash
  logoText: string;
  logoUrl?: string; // Logo image URL (optional)
  primaryColor: string; // Primary color in hex format (e.g. "#0EA5E9")
  secondaryColor: string; // Secondary color in hex format (e.g. "#06B6D4")

  // Broker details
  brokerName: string;
  phone: string;
  whatsapp: string; // Number without spaces or special characters (e.g. "5215512345678")
  email: string;
  city: string;
  address: string;
  slogan: string;

  // Social networks (optional)
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;

  // Automation hooks (optional)
  leadWebhookUrl?: string; // Webhook URL to send leads (Make, Zapier, etc.)
  chatScript?: string; // Chat widget HTML/JS (Crisp, Intercom, Tidio, etc.)
}

export const siteConfig: SiteConfig = {
  // ============================================
  // SITE INFORMATION
  // ============================================
  siteName: ${JSON.stringify(config.siteName)},
  siteUrl: ${JSON.stringify(config.siteUrl)},
  logoText: ${JSON.stringify(config.logoText)},
  logoUrl: ${config.logoUrl ? JSON.stringify(config.logoUrl) : "undefined"},
  primaryColor: ${JSON.stringify(config.primaryColor)},
  secondaryColor: ${JSON.stringify(config.secondaryColor)},
  
  // ============================================
  // BROKER DETAILS
  // ============================================
  brokerName: ${JSON.stringify(config.brokerName)},
  phone: ${JSON.stringify(config.phone)},
  whatsapp: ${JSON.stringify(config.whatsapp)},
  email: ${JSON.stringify(config.email)},
  city: ${JSON.stringify(config.city)},
  address: ${JSON.stringify(config.address)},
  slogan: ${JSON.stringify(config.slogan)},
  
  // ============================================
  // SOCIAL NETWORKS
  // ============================================
  facebook: ${config.facebook ? JSON.stringify(config.facebook) : "undefined"},
  instagram: ${config.instagram ? JSON.stringify(config.instagram) : "undefined"},
  tiktok: ${config.tiktok ? JSON.stringify(config.tiktok) : "undefined"},
  linkedin: ${config.linkedin ? JSON.stringify(config.linkedin) : "undefined"},
  website: ${config.website ? JSON.stringify(config.website) : "undefined"},
  
  // ============================================
  // AUTOMATIONS
  // ============================================
  leadWebhookUrl: ${config.leadWebhookUrl ? JSON.stringify(config.leadWebhookUrl) : "undefined"},
  chatScript: ${config.chatScript ? JSON.stringify(config.chatScript) : "undefined"},
};
`;
}

/**
 * Generates the contents of the properties.ts file.
 */
function generatePropertiesFile(properties: Property[]): string {
  const propertiesString = properties
    .map((prop) => {
      return `  {
    id: ${JSON.stringify(prop.id)},
    slug: ${JSON.stringify(prop.slug)},
    title: ${JSON.stringify(prop.title)},
    description: ${JSON.stringify(prop.description)},${prop.titleEn ? `\n    titleEn: ${JSON.stringify(prop.titleEn)},` : ""}${prop.descriptionEn ? `\n    descriptionEn: ${JSON.stringify(prop.descriptionEn)},` : ""}
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
 * PROPERTY DATA
 *
 * This file contains the Property type and the properties array.
 * To add or edit properties, modify the 'properties' array below.
 */

export const MAX_PROPERTIES = 50;

export type PropertyType = "venta" | "renta";
export type Currency = "MXN" | "USD";

export interface Property {
  id: string;
  slug: string; // Friendly URL (e.g. "departamento-reforma-123")
  title: string;
  description: string;
  /** English translation of the title (optional). Falls back to \`title\`. */
  titleEn?: string;
  /** English translation of the description (optional). Falls back to \`description\`. */
  descriptionEn?: string;
  type: PropertyType;
  price: number;
  currency: Currency;
  location: string; // Address or neighborhood
  city: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number; // Area in m²
  featured?: boolean; // If true, shows in the featured section on the home page
  images: string[]; // Image URLs
  tourUrl?: string; // Optional virtual tour URL (Matterport, YouTube, Vimeo, etc.)
}

export const properties: Property[] = [
${propertiesString}
];

/**
 * Helper to get a property by slug.
 */
export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}

/**
 * Helper to get featured properties.
 */
export function getFeaturedProperties(): Property[] {
  return properties.filter((property) => property.featured === true);
}

/**
 * Helper to get the unique cities across all properties.
 */
export function getUniqueCities(): string[] {
  const cities = properties.map((property) => property.city);
  return Array.from(new Set(cities));
}

/**
 * Returns a copy of the property with text fields in the given locale.
 * For "en" it uses titleEn/descriptionEn when present; otherwise Spanish.
 * Price, currency, city and location are kept intact (local context).
 */
export function localizeProperty(property: Property, locale?: string): Property {
  if (locale !== "en") return property;
  return {
    ...property,
    title: property.titleEn ?? property.title,
    description: property.descriptionEn ?? property.description,
  };
}

/** Applies localizeProperty to a list of properties. */
export function localizeProperties(
  list: Property[],
  locale?: string
): Property[] {
  return list.map((property) => localizeProperty(property, locale));
}
`;
}

/**
 * Writes the site configuration to its file.
 */
export function writeSiteConfig(config: SiteConfig): void {
  try {
    const content = generateSiteConfigFile(config);
    fs.writeFileSync(CONFIG_PATH, content, "utf-8");
  } catch (error) {
    console.error("Error writing siteConfig:", error);
    throw new Error("Failed to save the configuration");
  }
}

/**
 * Writes the properties to their file.
 */
export function writeProperties(properties: Property[]): void {
  try {
    const content = generatePropertiesFile(properties);
    fs.writeFileSync(PROPERTIES_PATH, content, "utf-8");
  } catch (error) {
    console.error("Error writing properties:", error);
    throw new Error("Failed to save the properties");
  }
}


