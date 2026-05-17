import { Property, PropertyType, Currency } from "@/data/properties";

export interface PropertyFilters {
  type: PropertyType | "all";
  city: string; // "all" o nombre de ciudad
  currency: Currency | "all";
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  q: string; // búsqueda de texto libre
}

export const DEFAULT_FILTERS: PropertyFilters = {
  type: "all",
  city: "all",
  currency: "all",
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  minBathrooms: null,
  q: "",
};

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  const q = filters.q.trim().toLowerCase();

  return properties.filter((p) => {
    if (filters.type !== "all" && p.type !== filters.type) return false;
    if (filters.city !== "all" && p.city !== filters.city) return false;
    if (filters.currency !== "all" && p.currency !== filters.currency) return false;

    // El rango de precio solo aplica si el usuario fijó una moneda específica;
    // comparar precios entre monedas distintas sin tipo de cambio sería incorrecto.
    if (filters.currency !== "all") {
      if (filters.minPrice !== null && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
    }

    if (filters.minBedrooms !== null && p.bedrooms < filters.minBedrooms) return false;
    if (filters.minBathrooms !== null && p.bathrooms < filters.minBathrooms) return false;

    if (q) {
      const haystack = `${p.title} ${p.description} ${p.location} ${p.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

/**
 * Convierte un objeto de filtros a un query object para Next router.
 * Omite valores en su default para mantener la URL limpia.
 */
export function filtersToQuery(filters: PropertyFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.type !== "all") query.type = filters.type;
  if (filters.city !== "all") query.city = filters.city;
  if (filters.currency !== "all") query.currency = filters.currency;
  if (filters.minPrice !== null) query.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== null) query.maxPrice = String(filters.maxPrice);
  if (filters.minBedrooms !== null) query.minBedrooms = String(filters.minBedrooms);
  if (filters.minBathrooms !== null) query.minBathrooms = String(filters.minBathrooms);
  if (filters.q.trim()) query.q = filters.q.trim();
  return query;
}

/**
 * Lee filtros desde el query object de Next router.
 * Valores inválidos vuelven al default.
 */
export function queryToFilters(query: Record<string, string | string[] | undefined>): PropertyFilters {
  const get = (k: string): string | undefined => {
    const v = query[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const getNum = (k: string): number | null => {
    const v = get(k);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const type = get("type");
  const currency = get("currency");

  return {
    type: type === "venta" || type === "renta" ? type : "all",
    city: get("city") || "all",
    currency: currency === "MXN" || currency === "USD" ? currency : "all",
    minPrice: getNum("minPrice"),
    maxPrice: getNum("maxPrice"),
    minBedrooms: getNum("minBedrooms"),
    minBathrooms: getNum("minBathrooms"),
    q: get("q") || "",
  };
}

export function hasActiveFilters(filters: PropertyFilters): boolean {
  return (
    filters.type !== "all" ||
    filters.city !== "all" ||
    filters.currency !== "all" ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minBedrooms !== null ||
    filters.minBathrooms !== null ||
    filters.q.trim() !== ""
  );
}
