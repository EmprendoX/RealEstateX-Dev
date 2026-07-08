"use client";

import React from "react";
import { useTranslation } from "next-i18next";
import { PropertyType, Currency } from "@/data/properties";
import {
  PropertyFilters as Filters,
  hasActiveFilters,
} from "@/utils/filterProperties";

interface PropertyFiltersProps {
  filters: Filters;
  cities: string[];
  resultCount: number;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function PropertyFiltersUI({
  filters,
  cities,
  resultCount,
  onChange,
  onReset,
}: PropertyFiltersProps) {
  const { t } = useTranslation("common");
  const priceDisabled = filters.currency === "all";

  const update = (patch: Partial<Filters>) => {
    onChange({ ...filters, ...patch });
  };

  // When the user changes currency to "all", we clear the price range
  // to avoid it staying invisible-but-applied by the helper.
  const handleCurrencyChange = (currency: Currency | "all") => {
    if (currency === "all") {
      update({ currency, minPrice: null, maxPrice: null });
    } else {
      update({ currency });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{t("filters.title")}</h2>
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-primary hover:underline font-medium"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>

      {/* Free-text search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("filters.search")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t("filters.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Type and city */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.operationType")}
          </label>
          <select
            value={filters.type}
            onChange={(e) =>
              update({ type: e.target.value as PropertyType | "all" })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="venta">{t("filters.typeSale")}</option>
            <option value="renta">{t("filters.typeRent")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.city")}
          </label>
          <select
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{t("filters.all")}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price and currency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.currency")}
          </label>
          <select
            value={filters.currency}
            onChange={(e) =>
              handleCurrencyChange(e.target.value as Currency | "all")
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.minPrice")}
          </label>
          <input
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              update({
                minPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            disabled={priceDisabled}
            placeholder={priceDisabled ? t("filters.chooseCurrency") : "0"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.maxPrice")}
          </label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              update({
                maxPrice: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            disabled={priceDisabled}
            placeholder={priceDisabled ? t("filters.chooseCurrency") : t("filters.noLimit")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Bedrooms and bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.bedrooms")}
          </label>
          <select
            value={filters.minBedrooms ?? ""}
            onChange={(e) =>
              update({
                minBedrooms: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">{t("filters.any")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.bathrooms")}
          </label>
          <select
            value={filters.minBathrooms ?? ""}
            onChange={(e) =>
              update({
                minBathrooms: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">{t("filters.any")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      {/* Results counter */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {t("filters.showing")} <span className="font-semibold">{resultCount}</span>{" "}
          {t("filters.resultsCount", { count: resultCount })}
        </p>
      </div>
    </div>
  );
}
