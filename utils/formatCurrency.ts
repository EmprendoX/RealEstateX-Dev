/**
 * Format a numeric amount as currency, localized to the active language.
 * USD amounts render as "$385,000 USD" (or "US$385,000" in en-US style).
 * MXN amounts render as "$385,000 MXN".
 */

import type { Currency } from "@/data/development";

export function formatCurrency(amount: number, currency: Currency, locale?: string): string {
  const loc = locale === "en" ? "en-US" : "es-MX";
  const formatter = new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}
