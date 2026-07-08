/**
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
  /** Traducción al inglés del título (opcional). Si falta, se usa `title`. */
  titleEn?: string;
  /** Traducción al inglés de la descripción (opcional). Si falta, se usa `description`. */
  descriptionEn?: string;
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
  {
    id: "1",
    slug: "casa-moderna-santa-fe",
    title: "Casa Moderna en Santa Fe",
    titleEn: "Modern House in Santa Fe",
    description: "Casa contemporánea con diseño arquitectónico único. Amplios espacios, jardín privado, terraza con vista y cocina integral de alta gama. Ubicada en una zona residencial exclusiva con fácil acceso a centros comerciales y corporativos.",
    descriptionEn: "Contemporary house with a unique architectural design. Spacious rooms, a private garden, a terrace with views and a high-end fitted kitchen. Located in an exclusive residential area with easy access to shopping and business centers.",
    type: "venta",
    price: 12500000,
    currency: "MXN",
    location: "Santa Fe",
    city: "Ciudad de México",
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    area: 320,
    featured: true,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"],
    tourUrl: "https://my.matterport.com/show/?m=SxQL3iGyoDo",
  },
  {
    id: "2",
    slug: "departamento-renta-roma",
    title: "Departamento en Renta - Roma Norte",
    titleEn: "Apartment for Rent - Roma Norte",
    description: "Acogedor departamento en una de las zonas más vibrantes de la ciudad. Cerca de restaurantes, cafeterías y vida nocturna. Ideal para jóvenes profesionales. Incluye todos los servicios y está listo para habitar.",
    descriptionEn: "Cozy apartment in one of the city's most vibrant neighborhoods. Close to restaurants, cafés and nightlife. Ideal for young professionals. Includes all utilities and is move-in ready.",
    type: "renta",
    price: 25000,
    currency: "MXN",
    location: "Roma Norte",
    city: "Ciudad de México",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    area: 85,
    featured: false,
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
  },
  {
    id: "3",
    slug: "penthouse-lujo-reforma",
    title: "Penthouse de Lujo en Reforma",
    titleEn: "Luxury Penthouse in Reforma",
    description: "Exclusivo penthouse con terraza privada y vista 360° de la ciudad. Acabados premium, cocina italiana, sistema de domótica y acceso a piscina y gimnasio. La oportunidad perfecta para vivir en el corazón financiero de la ciudad.",
    descriptionEn: "Exclusive penthouse with a private terrace and 360° views of the city. Premium finishes, an Italian kitchen, a home automation system and access to a pool and gym. The perfect opportunity to live in the city's financial heart.",
    type: "venta",
    price: 18500000,
    currency: "MXN",
    location: "Paseo de la Reforma",
    city: "Ciudad de México",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    area: 250,
    featured: true,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"],
  },
  {
    id: "4",
    slug: "casa-renta-coyoacan",
    title: "Casa en Renta - Coyoacán",
    titleEn: "House for Rent - Coyoacán",
    description: "Encantadora casa tradicional con patio central y mucho carácter. Ubicada en una calle tranquila del histórico barrio de Coyoacán. Perfecta para familias que buscan un ambiente tranquilo y cercano a parques y escuelas.",
    descriptionEn: "Charming traditional house with a central courtyard and plenty of character. Located on a quiet street in the historic neighborhood of Coyoacán. Perfect for families looking for a peaceful setting close to parks and schools.",
    type: "renta",
    price: 35000,
    currency: "MXN",
    location: "Coyoacán",
    city: "Ciudad de México",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: 200,
    featured: false,
    images: ["https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"],
  }
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

/**
 * Devuelve una copia de la propiedad con los campos de texto en el idioma dado.
 * Para "en" usa titleEn/descriptionEn si existen; en cualquier otro caso (o si
 * falta la traducción) devuelve el texto en español. El precio, la moneda, la
 * ciudad y la ubicación se mantienen intactos (contexto local).
 */
export function localizeProperty(property: Property, locale?: string): Property {
  if (locale !== "en") return property;
  return {
    ...property,
    title: property.titleEn ?? property.title,
    description: property.descriptionEn ?? property.description,
  };
}

/** Aplica localizeProperty a una lista de propiedades. */
export function localizeProperties(
  list: Property[],
  locale?: string
): Property[] {
  return list.map((property) => localizeProperty(property, locale));
}
