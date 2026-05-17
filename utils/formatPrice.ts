/**
 * Función helper para formatear precios según la moneda
 */

import { Currency } from "@/data/properties";

export function formatPrice(price: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}


