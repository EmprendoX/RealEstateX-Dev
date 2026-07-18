/**
 * SITE CONFIG
 *
 * Site-level branding, contact, and integrations for THIS instance.
 * Values live in config/siteConfig.json (edited via /admin/config or by hand).
 * This file exposes the typed interface + the loaded value.
 */

import raw from "./siteConfig.json";

export type DisplayFont = "fraunces" | "cormorant" | "playfair";
export type BodyFont = "inter" | "manrope";

export interface SiteConfig {
  // Identity
  siteName: string;
  siteUrl: string;
  logoText: string;
  logoUrl?: string;

  // Contact
  phone: string;
  whatsapp: string;
  email: string;
  officeAddress?: string;

  // Branding
  primaryColor: string;
  accentColor: string;
  inkColor: string;
  surfaceColor: string;

  // Typography
  displayFont: DisplayFont;
  bodyFont: BodyFont;

  // Developer company (short — full record in development.developer)
  developerCompany: string;

  // Social (optional)
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;

  // Integrations (optional)
  leadWebhookUrl?: string;
  chatScript?: string;
  brochureRequiresLead?: boolean;
}

export const siteConfig: SiteConfig = raw as unknown as SiteConfig;
