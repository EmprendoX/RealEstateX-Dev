"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/formatPrice";

interface MortgageCalculatorProps {
  property: Property;
}

const DEFAULT_DOWN_PCT = 20;
const DEFAULT_YEARS = 20;
const DEFAULT_RATE = 10;

/**
 * Monthly payment of a French-amortization loan (fixed installments).
 *   M = P * (r * (1+r)^n) / ((1+r)^n - 1)
 * where P = principal, r = monthly rate (annual/12/100), n = months.
 * If r = 0 (0% rate), the payment is simply P/n.
 */
function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * (r * pow)) / (pow - 1);
}

export default function MortgageCalculator({ property }: MortgageCalculatorProps) {
  const { t } = useTranslation("common");
  const [downPct, setDownPct] = useState(DEFAULT_DOWN_PCT);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [ratePct, setRatePct] = useState(DEFAULT_RATE);

  const calc = useMemo(() => {
    const downAmount = (property.price * downPct) / 100;
    const loanAmount = property.price - downAmount;
    const monthly = monthlyPayment(loanAmount, ratePct, years);
    const totalPaid = monthly * years * 12 + downAmount;
    const totalInterest = monthly * years * 12 - loanAmount;
    return { downAmount, loanAmount, monthly, totalPaid, totalInterest };
  }, [property.price, downPct, years, ratePct]);

  const fmt = (v: number) => formatPrice(Math.round(v), property.currency);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
      <div className="flex items-start gap-3 mb-2">
        <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V5z" />
        </svg>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("mortgage.title")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("mortgage.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
        {/* Down payment */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="down-pct" className="text-sm font-medium text-gray-700">
              {t("mortgage.downPayment")}
            </label>
            <span className="text-sm font-semibold text-primary">{downPct}%</span>
          </div>
          <input
            id="down-pct"
            type="range"
            min={5}
            max={80}
            step={1}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-gray-500 mt-1">{fmt(calc.downAmount)}</p>
        </div>

        {/* Term */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="years" className="text-sm font-medium text-gray-700">
              {t("mortgage.term")}
            </label>
            <span className="text-sm font-semibold text-primary">{t("mortgage.years", { count: years })}</span>
          </div>
          <input
            id="years"
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-gray-500 mt-1">{t("mortgage.monthlyPayments", { count: years * 12 })}</p>
        </div>

        {/* Rate */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="rate" className="text-sm font-medium text-gray-700">
              {t("mortgage.annualRate")}
            </label>
            <span className="text-sm font-semibold text-primary">{ratePct.toFixed(1)}%</span>
          </div>
          <input
            id="rate"
            type="range"
            min={1}
            max={20}
            step={0.1}
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-gray-500 mt-1">{t("mortgage.annualRateFixed")}</p>
        </div>
      </div>

      {/* Highlighted result */}
      <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-5 mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">
          {t("mortgage.estimatedMonthlyPayment")}
        </p>
        <p className="text-3xl md:text-4xl font-bold text-primary">
          {fmt(calc.monthly)}
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">{t("mortgage.price")}</p>
          <p className="font-semibold text-gray-900">{fmt(property.price)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">{t("mortgage.loanAmount")}</p>
          <p className="font-semibold text-gray-900">{fmt(calc.loanAmount)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">{t("mortgage.totalInterest")}</p>
          <p className="font-semibold text-gray-900">{fmt(calc.totalInterest)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">{t("mortgage.totalToPay")}</p>
          <p className="font-semibold text-gray-900">{fmt(calc.totalPaid)}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        {t("mortgage.disclaimer")}
      </p>
    </div>
  );
}
