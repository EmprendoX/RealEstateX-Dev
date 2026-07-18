/**
 * SITE CONFIG
 *
 * Site-level branding, contact, and integration settings for THIS instance.
 * Development content (models, units, payment plan, etc.) lives in
 * `data/development.ts` — do not put it here.
 */

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

  // Branding — desert-modernism defaults
  primaryColor: string;   // main brand color (Sea of Cortez blue for Cardón)
  accentColor: string;    // secondary accent (warm sand)
  inkColor: string;       // primary text / UI dark
  surfaceColor: string;   // page background base

  // Typography
  displayFont: DisplayFont;
  bodyFont: BodyFont;

  // Developer company name (short; full record in development.developer)
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

export const siteConfig: SiteConfig = {
  // ============================================
  // IDENTITY
  // ============================================
  siteName: "Cardón",
  siteUrl: "https://cardon.mx",
  logoText: "Cardón",
  logoUrl: undefined,

  // ============================================
  // CONTACT
  // ============================================
  phone: "+52 624 145 8200",
  whatsapp: "5216241458200",
  email: "hola@cardon.mx",
  officeAddress: "Camino a La Ribera Km 4, Baja California Sur",

  // ============================================
  // BRANDING — desert modernism
  // ============================================
  primaryColor: "#1E3A5F",   // deep Sea of Cortez blue
  accentColor: "#C9A87C",    // warm sand
  inkColor: "#1A1A1A",       // charcoal
  surfaceColor: "#F5F1EA",   // bone

  // ============================================
  // TYPOGRAPHY
  // ============================================
  displayFont: "fraunces",
  bodyFont: "inter",

  // ============================================
  // DEVELOPER COMPANY
  // ============================================
  developerCompany: "Nakawe Group",

  // ============================================
  // SOCIAL
  // ============================================
  instagram: "https://instagram.com/cardon.mx",
  facebook: undefined,
  tiktok: undefined,
  linkedin: undefined,
  website: undefined,

  // ============================================
  // INTEGRATIONS
  // ============================================
  leadWebhookUrl: undefined,
  chatScript: undefined,
  brochureRequiresLead: true,
};
