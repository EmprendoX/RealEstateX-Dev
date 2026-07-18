/**
 * DEVELOPMENT — canonical data for THIS site's project.
 *
 * A RealEstateX-Development instance = one real estate project.
 * All content the landing page needs (concept, models, units, availability,
 * payment plan, investor assumptions, construction progress, developer info)
 * lives here.
 */

export type UnitStatus = "available" | "reserved" | "sold";
export type Currency = "USD" | "MXN";
export type OwnershipGoal = "live" | "invest" | "both";
export type DevelopmentStatus = "preventa" | "construccion" | "entrega" | "entregado";

export interface I18nText {
  es: string;
  en: string;
}

export interface I18nList {
  es: string[];
  en: string[];
}

export interface DevelopmentModel {
  id: string;
  slug: string;
  name: I18nText;
  description: I18nText;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaExterior?: number;
  parking?: number;
  priceFrom: number;
  priceTo?: number;
  floorPlanImage?: string;
  renderImages: string[];
  features: I18nList;
}

export interface Unit {
  id: string;
  modelId: string;
  building?: string;
  level: number;
  orientation?: I18nText;
  area: number;
  price: number;
  status: UnitStatus;
}

export interface Amenity {
  icon: string;
  name: I18nText;
  description: I18nText;
}

export interface ConstructionMilestone {
  id: string;
  title: I18nText;
  date: string;
  status: "completed" | "in_progress" | "upcoming";
  progressPercent?: number;
  photos?: string[];
  notes?: I18nText;
}

export interface PaymentPlan {
  reservation: {
    amount: number;
    currency: Currency;
    note: I18nText;
  };
  downPayment: {
    percent: number;
    note: I18nText;
  };
  installments: {
    count: number;
    percentTotal: number;
    note: I18nText;
  };
  onDelivery: {
    percent: number;
    note: I18nText;
  };
  cashDiscount?: {
    percent: number;
    note: I18nText;
  };
}

export interface InvestmentAssumptions {
  averageDailyRateUSD: number;
  occupancyPercent: number;
  monthlyOperatingCostUSD: number;
  annualAppreciationPercent: number;
  managementFeePercent: number;
  notes: I18nText;
}

export interface LocationDistance {
  label: I18nText;
  minutes: number;
}

export interface LocationDetail {
  address: I18nText;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  distances: LocationDistance[];
}

export interface DeveloperCompany {
  name: string;
  founded?: number;
  projectsDelivered?: number;
  totalUnitsDelivered?: number;
  description: I18nText;
  logoUrl?: string;
}

export interface ConceptHighlight {
  label: I18nText;
  body: I18nText;
}

export interface Development {
  slug: string;
  name: string;
  tagline: I18nText;
  heroHeadline: I18nText;
  heroPoints: I18nList;
  intro: I18nText;
  currency: Currency;
  status: DevelopmentStatus;
  deliveryDate: string;
  totalUnits: number;
  heroImages: string[];
  heroVideoUrl?: string;
  galleryImages: string[];
  brochureUrl?: string;
  concept: {
    heading: I18nText;
    body: I18nText;
    highlights: ConceptHighlight[];
  };
  location: LocationDetail;
  amenities: Amenity[];
  models: DevelopmentModel[];
  units: Unit[];
  paymentPlan: PaymentPlan;
  investment: InvestmentAssumptions;
  construction: ConstructionMilestone[];
  developer: DeveloperCompany;
}

// ---------- Helpers ----------

function tText(text: I18nText | undefined, locale?: string): string {
  if (!text) return "";
  return locale === "en" ? text.en : text.es;
}

function tList(list: I18nList | undefined, locale?: string): string[] {
  if (!list) return [];
  return locale === "en" ? list.en : list.es;
}

export const t = { text: tText, list: tList };

export function getModelById(dev: Development, id: string): DevelopmentModel | undefined {
  return dev.models.find((m) => m.id === id);
}

export function getUnitsByModel(dev: Development, modelId: string): Unit[] {
  return dev.units.filter((u) => u.modelId === modelId);
}

export function getUnitsByStatus(dev: Development, status: UnitStatus): Unit[] {
  return dev.units.filter((u) => u.status === status);
}

export function availableUnitsCount(dev: Development): number {
  return getUnitsByStatus(dev, "available").length;
}

export function absorptionPercent(dev: Development): number {
  const soldOrReserved = dev.units.filter(
    (u) => u.status === "sold" || u.status === "reserved"
  ).length;
  return Math.round((soldOrReserved / dev.units.length) * 100);
}

// ---------- Cardón showcase content ----------
//
// Fictitious boutique preventa in East Cape, Baja California Sur.
// Replace this whole object with your project's real content when
// deploying a new instance.

// Hero background images. PLACEHOLDER Unsplash photos — swap for the real
// project photography before launch. If a URL renders the wrong subject,
// grab one you like from unsplash.com and paste its `photo-...` id here.
const CARDON_HERO = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=80",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2400&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=2400&q=80",
];

const CARDON_GALLERY = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
];

const CARDON_MODELS: DevelopmentModel[] = [
  {
    id: "model-studio",
    slug: "cardon-studio",
    name: { es: "Cardón Studio", en: "Cardón Studio" },
    description: {
      es: "Estudio compacto con vista al Mar de Cortés, terraza privada y acabados en piedra y madera cálida. Diseñado para uso propio ocasional y renta vacacional de alto rendimiento.",
      en: "Compact studio with Sea of Cortez views, private terrace, and stone and warm-wood finishes. Designed for personal getaways and high-yield vacation rental.",
    },
    bedrooms: 0,
    bathrooms: 1,
    area: 55,
    areaExterior: 12,
    parking: 1,
    priceFrom: 385000,
    priceTo: 445000,
    floorPlanImage: "/floor-plans/studio.svg",
    renderImages: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80",
    ],
    features: {
      es: [
        "Vista al Mar de Cortés",
        "Terraza privada 12 m²",
        "Cocina italiana integrada",
        "Aire acondicionado inverter",
        "Amueblado turnkey opcional",
      ],
      en: [
        "Sea of Cortez view",
        "Private 12 m² terrace",
        "Italian integrated kitchen",
        "Inverter A/C",
        "Optional turnkey furnishing",
      ],
    },
  },
  {
    id: "model-suite",
    slug: "cardon-suite",
    name: { es: "Cardón Suite", en: "Cardón Suite" },
    description: {
      es: "Suite de una recámara con acceso directo al beach club y plunge pool en algunas unidades. Cocina completa, sala-comedor abierta al Mar de Cortés.",
      en: "One-bedroom suite with direct beach club access and plunge pool in select units. Full kitchen, open living-dining opening to the Sea of Cortez.",
    },
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    areaExterior: 22,
    parking: 1,
    priceFrom: 580000,
    priceTo: 725000,
    floorPlanImage: "/floor-plans/suite.svg",
    renderImages: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80",
    ],
    features: {
      es: [
        "Acceso directo al beach club",
        "Terraza de 22 m² con vista al mar",
        "Cocina italiana con isla",
        "Walk-in closet",
        "Plunge pool en unidades selectas",
      ],
      en: [
        "Direct beach club access",
        "22 m² ocean-view terrace",
        "Italian kitchen with island",
        "Walk-in closet",
        "Plunge pool in select units",
      ],
    },
  },
  {
    id: "model-penthouse",
    slug: "cardon-penthouse",
    name: { es: "Cardón Penthouse", en: "Cardón Penthouse" },
    description: {
      es: "Penthouse de dos recámaras en el último nivel, con rooftop privado, alberca climatizada y vista panorámica al Mar de Cortés y a la Sierra de la Laguna.",
      en: "Two-bedroom top-floor penthouse with private rooftop, heated pool, and panoramic views of the Sea of Cortez and the Sierra de la Laguna.",
    },
    bedrooms: 2,
    bathrooms: 2,
    area: 135,
    areaExterior: 65,
    parking: 2,
    priceFrom: 1150000,
    priceTo: 1385000,
    floorPlanImage: "/floor-plans/penthouse.svg",
    renderImages: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
    ],
    features: {
      es: [
        "Rooftop privado 65 m²",
        "Plunge pool climatizada",
        "Vista al Mar de Cortés y sierra",
        "Cocina profesional",
        "Master suite con vestidor",
        "Dos cajones de estacionamiento",
      ],
      en: [
        "Private 65 m² rooftop",
        "Heated plunge pool",
        "Sea of Cortez and mountain views",
        "Chef-grade kitchen",
        "Master suite with walk-in closet",
        "Two parking spaces",
      ],
    },
  },
  {
    id: "model-sky-villa",
    slug: "cardon-sky-villa",
    name: { es: "Cardón Sky Villa", en: "Cardón Sky Villa" },
    description: {
      es: "Sky villa de tres recámaras — la unidad insignia del proyecto. Doble altura, rooftop privado con jacuzzi y firepit, cocina profesional y acceso preferente al beach club.",
      en: "Three-bedroom sky villa — the project's flagship unit. Double-height ceilings, private rooftop with jacuzzi and firepit, chef-grade kitchen, and priority beach-club access.",
    },
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    areaExterior: 110,
    parking: 2,
    priceFrom: 1850000,
    priceTo: 1985000,
    floorPlanImage: "/floor-plans/sky-villa.svg",
    renderImages: [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80",
    ],
    features: {
      es: [
        "Rooftop privado con jacuzzi y firepit",
        "Doble altura en sala",
        "Cocina profesional Gaggenau",
        "Master suite con terraza",
        "Servicio concierge dedicado",
        "Programa de rental management incluido",
      ],
      en: [
        "Private rooftop with jacuzzi and firepit",
        "Double-height living",
        "Gaggenau chef kitchen",
        "Master suite with private terrace",
        "Dedicated concierge service",
        "Rental management program included",
      ],
    },
  },
];

// 28 units distributed across 4 models.
// Building A, 4 levels: L1-L3 studios + suites, L4 penthouses + sky villas.
const CARDON_UNITS: Unit[] = [
  // Level 1 — 4 Studios + 2 Suites
  { id: "A-101", modelId: "model-studio", building: "A", level: 1, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 385000, status: "sold" },
  { id: "A-102", modelId: "model-studio", building: "A", level: 1, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 395000, status: "sold" },
  { id: "A-103", modelId: "model-studio", building: "A", level: 1, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 395000, status: "available" },
  { id: "A-104", modelId: "model-studio", building: "A", level: 1, orientation: { es: "Vista lateral", en: "Side view" }, area: 55, price: 385000, status: "available" },
  { id: "A-105", modelId: "model-suite", building: "A", level: 1, orientation: { es: "Beachfront", en: "Beachfront" }, area: 85, price: 640000, status: "reserved" },
  { id: "A-106", modelId: "model-suite", building: "A", level: 1, orientation: { es: "Beachfront con plunge pool", en: "Beachfront with plunge pool" }, area: 85, price: 725000, status: "sold" },

  // Level 2 — 4 Studios + 4 Suites
  { id: "A-201", modelId: "model-studio", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 405000, status: "sold" },
  { id: "A-202", modelId: "model-studio", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 405000, status: "available" },
  { id: "A-203", modelId: "model-studio", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 405000, status: "available" },
  { id: "A-204", modelId: "model-studio", building: "A", level: 2, orientation: { es: "Vista lateral", en: "Side view" }, area: 55, price: 395000, status: "available" },
  { id: "A-205", modelId: "model-suite", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 610000, status: "sold" },
  { id: "A-206", modelId: "model-suite", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 610000, status: "reserved" },
  { id: "A-207", modelId: "model-suite", building: "A", level: 2, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 610000, status: "available" },
  { id: "A-208", modelId: "model-suite", building: "A", level: 2, orientation: { es: "Esquina, vista panorámica", en: "Corner, panoramic view" }, area: 85, price: 685000, status: "available" },

  // Level 3 — 4 Studios + 4 Suites
  { id: "A-301", modelId: "model-studio", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 425000, status: "reserved" },
  { id: "A-302", modelId: "model-studio", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 425000, status: "available" },
  { id: "A-303", modelId: "model-studio", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 55, price: 425000, status: "available" },
  { id: "A-304", modelId: "model-studio", building: "A", level: 3, orientation: { es: "Vista lateral", en: "Side view" }, area: 55, price: 415000, status: "available" },
  { id: "A-305", modelId: "model-suite", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 640000, status: "sold" },
  { id: "A-306", modelId: "model-suite", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 640000, status: "available" },
  { id: "A-307", modelId: "model-suite", building: "A", level: 3, orientation: { es: "Vista al mar", en: "Ocean view" }, area: 85, price: 640000, status: "available" },
  { id: "A-308", modelId: "model-suite", building: "A", level: 3, orientation: { es: "Esquina, vista panorámica", en: "Corner, panoramic view" }, area: 85, price: 715000, status: "reserved" },

  // Level 4 — Penthouses + Sky Villas
  { id: "A-PH1", modelId: "model-penthouse", building: "A", level: 4, orientation: { es: "Rooftop vista mar", en: "Rooftop ocean view" }, area: 135, price: 1150000, status: "sold" },
  { id: "A-PH2", modelId: "model-penthouse", building: "A", level: 4, orientation: { es: "Rooftop vista mar", en: "Rooftop ocean view" }, area: 135, price: 1195000, status: "available" },
  { id: "A-PH3", modelId: "model-penthouse", building: "A", level: 4, orientation: { es: "Rooftop vista sierra", en: "Rooftop mountain view" }, area: 135, price: 1150000, status: "available" },
  { id: "A-PH4", modelId: "model-penthouse", building: "A", level: 4, orientation: { es: "Rooftop esquina panorámica", en: "Rooftop panoramic corner" }, area: 135, price: 1385000, status: "reserved" },
  { id: "A-SV1", modelId: "model-sky-villa", building: "A", level: 4, orientation: { es: "Sky villa vista Mar de Cortés", en: "Sky villa Sea of Cortez view" }, area: 220, price: 1850000, status: "available" },
  { id: "A-SV2", modelId: "model-sky-villa", building: "A", level: 4, orientation: { es: "Sky villa esquina panorámica", en: "Sky villa panoramic corner" }, area: 220, price: 1985000, status: "available" },
];

const CARDON_AMENITIES: Amenity[] = [
  {
    icon: "waves",
    name: { es: "Alberca infinita sobre el mar", en: "Infinity pool over the sea" },
    description: {
      es: "Alberca climatizada de 28 metros con borde infinito hacia el Mar de Cortés.",
      en: "Heated 28-meter infinity pool with edge dissolving into the Sea of Cortez.",
    },
  },
  {
    icon: "umbrella",
    name: { es: "Beach club privado", en: "Private beach club" },
    description: {
      es: "Playa privada con servicio de bebidas, tumbonas y palapas para residentes y huéspedes.",
      en: "Private beach with drink service, sunbeds and palapas for residents and guests.",
    },
  },
  {
    icon: "flame",
    name: { es: "Spa con temazcal moderno", en: "Spa with modern temazcal" },
    description: {
      es: "Circuito de hidroterapia, sauna, temazcal contemporáneo y cabinas de masaje.",
      en: "Hydrotherapy circuit, sauna, contemporary temazcal, and massage cabins.",
    },
  },
  {
    icon: "utensils",
    name: { es: "Restaurante farm-to-table", en: "Farm-to-table restaurant" },
    description: {
      es: "Cocina de autor con producto local de la Sierra de la Laguna y pesca del Cortés.",
      en: "Signature cuisine featuring produce from the Sierra de la Laguna and Cortez-caught seafood.",
    },
  },
  {
    icon: "laptop",
    name: { es: "Coworking al aire libre", en: "Open-air coworking" },
    description: {
      es: "Espacios de trabajo bajo palapa con fibra dedicada, cabinas de llamadas y sala de juntas.",
      en: "Palapa workspaces with dedicated fiber, phone booths and a meeting room.",
    },
  },
  {
    icon: "sun",
    name: { es: "Deck de yoga y meditación", en: "Yoga and meditation deck" },
    description: {
      es: "Deck elevado sobre las dunas con clases diarias de yoga, sound baths y meditación.",
      en: "Deck raised over the dunes with daily yoga, sound baths and meditation.",
    },
  },
  {
    icon: "anchor",
    name: { es: "Dock de kayaks y paddleboards", en: "Kayak and paddleboard dock" },
    description: {
      es: "Equipos disponibles todo el año para explorar la bahía y el Parque Nacional Cabo Pulmo.",
      en: "Year-round equipment to explore the bay and Cabo Pulmo National Park.",
    },
  },
  {
    icon: "wine",
    name: { es: "Wine cellar climatizada", en: "Climate-controlled wine cellar" },
    description: {
      es: "Cava con selección curada de vinos mexicanos del Valle de Guadalupe y del mundo.",
      en: "Curated cellar of Mexican wines from Valle de Guadalupe and international selections.",
    },
  },
  {
    icon: "dumbbell",
    name: { es: "Fitness center con vista", en: "Fitness center with a view" },
    description: {
      es: "Equipamiento Technogym completo, con vista al mar y programa de entrenadores.",
      en: "Full Technogym equipment overlooking the sea, with an on-call trainer program.",
    },
  },
  {
    icon: "concierge-bell",
    name: { es: "Concierge y rental management", en: "Concierge and rental management" },
    description: {
      es: "Servicio bilingüe 24/7 y programa opcional de administración de renta vacacional.",
      en: "Bilingual 24/7 service and optional vacation-rental management program.",
    },
  },
];

const CARDON_CONSTRUCTION: ConstructionMilestone[] = [
  {
    id: "milestone-permits",
    title: { es: "Permisos y licencias", en: "Permits and licensing" },
    date: "2025-11",
    status: "completed",
    notes: {
      es: "Manifestación de impacto ambiental, uso de suelo y licencias de construcción aprobados.",
      en: "Environmental impact statement, land use, and construction permits approved.",
    },
  },
  {
    id: "milestone-groundwork",
    title: { es: "Movimiento de tierras", en: "Site preparation" },
    date: "2026-02",
    status: "completed",
    notes: {
      es: "Terracería y nivelación terminadas. Accesos e infraestructura primaria completa.",
      en: "Grading and levelling complete. Access roads and primary infrastructure done.",
    },
  },
  {
    id: "milestone-foundation",
    title: { es: "Cimentación", en: "Foundation" },
    date: "2026-06",
    status: "in_progress",
    progressPercent: 60,
    notes: {
      es: "Zapatas y contratrabes ejecutadas en 6 unidades de la Torre A. Continúa en L1.",
      en: "Footings and grade beams completed on 6 units of Tower A. Ongoing on Level 1.",
    },
  },
  {
    id: "milestone-structure",
    title: { es: "Estructura y niveles", en: "Structure and floors" },
    date: "2026-10",
    status: "upcoming",
    notes: {
      es: "Estructura de concreto proyectada de Q4 2026 a Q2 2027.",
      en: "Concrete structure scheduled from Q4 2026 through Q2 2027.",
    },
  },
  {
    id: "milestone-envelope",
    title: { es: "Fachada e instalaciones", en: "Envelope and MEP" },
    date: "2027-04",
    status: "upcoming",
  },
  {
    id: "milestone-finishes",
    title: { es: "Acabados y amenidades", en: "Finishes and amenities" },
    date: "2027-09",
    status: "upcoming",
  },
  {
    id: "milestone-delivery",
    title: { es: "Entrega", en: "Delivery" },
    date: "2028-01",
    status: "upcoming",
    notes: {
      es: "Entrega escalonada por nivel a partir de Q1 2028.",
      en: "Phased delivery by floor starting Q1 2028.",
    },
  },
];

export const development: Development = {
  slug: "cardon",
  name: "Cardón",
  tagline: {
    es: "Vive el Mar de Cortés desde el desierto.",
    en: "Live the Sea of Cortez from the desert.",
  },
  heroHeadline: {
    es: "Una colección privada de 28 residencias entre el desierto y el Mar de Cortés.",
    en: "A private collection of 28 residences between the desert and the Sea of Cortez.",
  },
  heroPoints: {
    es: ["Arquitectura contemporánea", "Beach club privado", "Rental management"],
    en: ["Contemporary architecture", "Private beach club", "Rental management"],
  },
  intro: {
    es: "Un desarrollo boutique de 28 residencias en East Cape, entre Los Barriles y La Ribera. Arquitectura contemporánea de piedra y madera, playa privada y un programa de renta vacacional integrado para quienes buscan un hogar de escape con rendimiento real.",
    en: "A boutique 28-residence project in East Cape, between Los Barriles and La Ribera. Contemporary stone-and-wood architecture, private beach, and an integrated vacation-rental program for buyers who want an escape home with real yield.",
  },
  currency: "USD",
  status: "preventa",
  deliveryDate: "2028-01",
  totalUnits: 28,
  heroImages: CARDON_HERO,
  galleryImages: CARDON_GALLERY,
  brochureUrl: undefined,
  concept: {
    heading: {
      es: "Diseñado para quienes eligen el Mar de Cortés antes que el Pacífico.",
      en: "Designed for buyers who choose the Sea of Cortez over the Pacific.",
    },
    body: {
      es: "East Cape es la última costa preservada de Baja Sur. Agua turquesa todo el año, sin marejadas del Pacífico, con la Sierra de la Laguna detrás y el Parque Nacional Cabo Pulmo a 25 minutos. Cardón trae arquitectura contemporánea al desierto costero — piedra local, madera cálida, líneas bajas que respetan la topografía — con las amenidades de un resort privado y sin la saturación de Cabo San Lucas.",
      en: "East Cape is the last preserved coastline in Baja Sur. Turquoise water year-round, no Pacific swell, the Sierra de la Laguna behind and Cabo Pulmo National Park 25 minutes away. Cardón brings contemporary architecture to the desert coast — local stone, warm wood, low horizontal lines that respect the topography — with the amenities of a private resort and none of the saturation of Cabo San Lucas.",
    },
    highlights: [
      {
        label: { es: "Ubicación", en: "Location" },
        body: {
          es: "East Cape, Baja California Sur. 55 minutos del aeropuerto de Los Cabos.",
          en: "East Cape, Baja California Sur. 55 minutes from Los Cabos International Airport.",
        },
      },
      {
        label: { es: "Escala boutique", en: "Boutique scale" },
        body: {
          es: "Sólo 28 residencias. Sin torres, sin pasillos infinitos.",
          en: "Only 28 residences. No towers, no endless corridors.",
        },
      },
      {
        label: { es: "Rendimiento", en: "Yield" },
        body: {
          es: "Programa de rental management integrado. ADR proyectado 520 USD, ocupación 68%.",
          en: "Integrated rental management program. Projected ADR 520 USD, 68% occupancy.",
        },
      },
      {
        label: { es: "Entrega", en: "Delivery" },
        body: {
          es: "Q1 2028. Plan de pagos en preventa con 15% de apartado.",
          en: "Q1 2028. Preventa payment plan starting at 15% down.",
        },
      },
    ],
  },
  location: {
    address: {
      es: "Camino a La Ribera Km 4, East Cape, Baja California Sur",
      en: "Camino a La Ribera Km 4, East Cape, Baja California Sur",
    },
    city: "La Ribera",
    state: "Baja California Sur",
    country: "México",
    latitude: 23.6055,
    longitude: -109.5878,
    distances: [
      { label: { es: "Playa privada", en: "Private beach" }, minutes: 2 },
      { label: { es: "Los Barriles centro", en: "Los Barriles downtown" }, minutes: 30 },
      { label: { es: "Parque Nacional Cabo Pulmo", en: "Cabo Pulmo National Park" }, minutes: 25 },
      { label: { es: "Aeropuerto Los Cabos (SJD)", en: "Los Cabos Airport (SJD)" }, minutes: 55 },
      { label: { es: "Marina Puerto Los Cabos", en: "Puerto Los Cabos Marina" }, minutes: 60 },
      { label: { es: "San José del Cabo", en: "San José del Cabo" }, minutes: 65 },
    ],
  },
  amenities: CARDON_AMENITIES,
  models: CARDON_MODELS,
  units: CARDON_UNITS,
  paymentPlan: {
    reservation: {
      amount: 15000,
      currency: "USD",
      note: {
        es: "Apartado reembolsable durante 15 días naturales, aplicable al enganche.",
        en: "Refundable within 15 calendar days, applied to the down payment.",
      },
    },
    downPayment: {
      percent: 15,
      note: {
        es: "A pagar en un plazo de 30 días desde la firma del contrato de compraventa.",
        en: "Payable within 30 days of signing the purchase agreement.",
      },
    },
    installments: {
      count: 24,
      percentTotal: 25,
      note: {
        es: "24 mensualidades sin intereses durante la etapa de construcción.",
        en: "24 interest-free monthly installments during the construction phase.",
      },
    },
    onDelivery: {
      percent: 60,
      note: {
        es: "Saldo pagadero contra entrega de escrituras. Financiamiento internacional disponible.",
        en: "Balance due upon delivery of title. International financing available.",
      },
    },
    cashDiscount: {
      percent: 8,
      note: {
        es: "Descuento del 8% sobre precio de lista para compras de contado.",
        en: "8% discount on list price for cash purchases.",
      },
    },
  },
  investment: {
    averageDailyRateUSD: 520,
    occupancyPercent: 68,
    monthlyOperatingCostUSD: 950,
    annualAppreciationPercent: 12,
    managementFeePercent: 20,
    notes: {
      es: "Estimaciones basadas en performance histórico del corredor East Cape en propiedades luxury de renta vacacional. No constituyen garantía de rendimiento.",
      en: "Estimates based on historical performance of the East Cape corridor for luxury vacation rentals. Not a guarantee of returns.",
    },
  },
  construction: CARDON_CONSTRUCTION,
  developer: {
    name: "Nakawe Group",
    founded: 2012,
    projectsDelivered: 4,
    totalUnitsDelivered: 186,
    description: {
      es: "Desarrolladora mexicana con foco en proyectos boutique en el corredor Los Cabos–East Cape. Cuatro proyectos entregados a tiempo, 186 unidades escrituradas y un track record de plusvalía promedio del 14% anual desde entrega.",
      en: "Mexican developer focused on boutique projects along the Los Cabos–East Cape corridor. Four on-time deliveries, 186 titled units, and an average post-delivery appreciation track record of 14% annually.",
    },
  },
};
