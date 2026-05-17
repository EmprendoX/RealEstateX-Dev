/**
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
  siteName: "RealEX",
  siteUrl: "https://realestatex.com",
  logoText: "RealEX",
  logoUrl: undefined,
  primaryColor: "#008cb4",
  secondaryColor: "#004d65",
  
  // ============================================
  // DATOS DEL BROKER
  // ============================================
  brokerName: "Juan Pérez",
  phone: "+52 55 1234 5678",
  whatsapp: "5215512345678",
  email: "contacto@realestatex.com",
  city: "Ciudad de México",
  address: "Av. Reforma 123, Col. Centro, CDMX",
  slogan: "Tu hogar ideal te está esperando",
  
  // ============================================
  // REDES SOCIALES
  // ============================================
  facebook: "https://facebook.com/tu-pagina",
  instagram: "https://instagram.com/tu-cuenta",
  tiktok: undefined,
  linkedin: undefined,
  website: undefined,
  
  // ============================================
  // AUTOMATIZACIONES
  // ============================================
  leadWebhookUrl: undefined,
  chatScript: undefined,
};

