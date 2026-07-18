/**
 * DEVELOPMENT — canonical data for THIS site's project.
 *
 * Content lives in data/development.json (edited by the admin panel or by hand).
 * This file exposes:
 *   - Static TypeScript types (Development, DevelopmentModel, Unit, ...)
 *   - The `development` value, imported from the JSON at build/dev time
 *   - Localization helpers `t.text` / `t.list`
 *   - Selectors (getModelById, getUnitsByModel, absorptionPercent, ...)
 *
 * When the admin writes to development.json in dev, Next.js re-reads the
 * import on the next request. In production (read-only FS), the JSON is
 * baked into the build.
 */

import developmentData from "./development.json";

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
  reservation: { amount: number; currency: Currency; note: I18nText };
  downPayment: { percent: number; note: I18nText };
  installments: { count: number; percentTotal: number; note: I18nText };
  onDelivery: { percent: number; note: I18nText };
  cashDiscount?: { percent: number; note: I18nText };
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
  virtualTourUrl?: string;
  virtualTourProvider?: "matterport" | "youtube" | "vimeo" | "generic";
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

// The JSON is validated only by TypeScript's structural typing on import.
// The admin panel writes back the same shape via a runtime check in the
// PUT /api/admin/development handler.
export const development: Development = developmentData as unknown as Development;

// ---------- Localization helpers ----------

function tText(text: I18nText | undefined, locale?: string): string {
  if (!text) return "";
  return locale === "en" ? text.en : text.es;
}

function tList(list: I18nList | undefined, locale?: string): string[] {
  if (!list) return [];
  return locale === "en" ? list.en : list.es;
}

export const t = { text: tText, list: tList };

// ---------- Selectors ----------

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
