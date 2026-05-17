"use client";

import React, { useMemo, useState } from "react";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/formatPrice";

interface MortgageCalculatorProps {
  property: Property;
}

const DEFAULT_DOWN_PCT = 20;
const DEFAULT_YEARS = 20;
const DEFAULT_RATE = 10;

/**
 * Cuota mensual de un préstamo de amortización francesa (cuotas fijas).
 *   M = P * (r * (1+r)^n) / ((1+r)^n - 1)
 * donde P = principal, r = tasa mensual (anual/12/100), n = meses.
 * Si r = 0 (tasa 0%), el pago es simplemente P/n.
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
            Calculadora de hipoteca
          </h2>
          <p className="text-sm text-gray-600">
            Estimá tu pago mensual aproximado. Los valores son orientativos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
        {/* Enganche */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="down-pct" className="text-sm font-medium text-gray-700">
              Enganche
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

        {/* Plazo */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="years" className="text-sm font-medium text-gray-700">
              Plazo
            </label>
            <span className="text-sm font-semibold text-primary">{years} años</span>
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
          <p className="text-xs text-gray-500 mt-1">{years * 12} pagos mensuales</p>
        </div>

        {/* Tasa */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="rate" className="text-sm font-medium text-gray-700">
              Tasa anual
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
          <p className="text-xs text-gray-500 mt-1">Anual fija estimada</p>
        </div>
      </div>

      {/* Resultado destacado */}
      <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-5 mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">
          Pago mensual estimado
        </p>
        <p className="text-3xl md:text-4xl font-bold text-primary">
          {fmt(calc.monthly)}
        </p>
      </div>

      {/* Desglose */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">Precio</p>
          <p className="font-semibold text-gray-900">{fmt(property.price)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">Monto del préstamo</p>
          <p className="font-semibold text-gray-900">{fmt(calc.loanAmount)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">Intereses totales</p>
          <p className="font-semibold text-gray-900">{fmt(calc.totalInterest)}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">Total a pagar</p>
          <p className="font-semibold text-gray-900">{fmt(calc.totalPaid)}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        💡 Esta calculadora usa amortización francesa (cuotas fijas) y no incluye
        impuestos, seguros ni gastos notariales. Consultá con tu banco para
        condiciones reales.
      </p>
    </div>
  );
}
