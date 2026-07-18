"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev, getUnitsByModel } from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionHeader from "./SectionHeader";

export default function InvestmentSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const [modelId, setModelId] = useState<string>(development.models[1]?.id || development.models[0].id);
  const model = development.models.find((m) => m.id === modelId) || development.models[0];
  const modelUnits = getUnitsByModel(development, model.id);
  const anchorUnit = modelUnits.find((u) => u.status === "available") || modelUnits[0];
  const price = anchorUnit?.price ?? model.priceFrom;

  const [adr, setAdr] = useState<number>(development.investment.averageDailyRateUSD);
  const [occupancy, setOccupancy] = useState<number>(development.investment.occupancyPercent);

  const monthlyOpex = development.investment.monthlyOperatingCostUSD;
  const mgmtFee = development.investment.managementFeePercent;
  const appreciation = development.investment.annualAppreciationPercent;

  const projection = useMemo(() => {
    const grossAnnual = adr * (occupancy / 100) * 365;
    const mgmtCost = grossAnnual * (mgmtFee / 100);
    const opexAnnual = monthlyOpex * 12;
    const netAnnual = grossAnnual - mgmtCost - opexAnnual;
    const grossYield = (grossAnnual / price) * 100;
    const netYield = (netAnnual / price) * 100;
    const appreciationYear = price * (appreciation / 100);
    const totalReturn = netAnnual + appreciationYear;
    const totalReturnPct = (totalReturn / price) * 100;
    return { grossAnnual, netAnnual, grossYield, netYield, appreciationYear, totalReturn, totalReturnPct };
  }, [adr, occupancy, monthlyOpex, mgmtFee, appreciation, price]);

  return (
    <section id="inversion" className="relative py-24 md:py-32 bg-ink text-white">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("investment.eyebrow")}
          heading={t("investment.heading")}
          intro={t("investment.intro")}
          invert
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 p-8">
            <p className="text-eyebrow text-accent mb-6">{t("investment.assumptionsLabel")}</p>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wide text-white/60 mb-2">
                {t("investment.selectModel")}
              </label>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full bg-transparent border-b border-white/30 focus:border-accent focus:outline-none py-2 text-white text-sm"
              >
                {development.models.map((m) => (
                  <option key={m.id} value={m.id} className="bg-ink text-white">
                    {tDev.text(m.name, locale)} — {formatCurrency(m.priceFrom, development.currency, locale)}
                  </option>
                ))}
              </select>
            </div>

            <SliderInput
              label={t("investment.adr")}
              suffix={t("investment.adrSuffix")}
              value={adr}
              min={200}
              max={900}
              step={10}
              onChange={setAdr}
              format={(v) => formatCurrency(v, "USD", locale)}
            />

            <SliderInput
              label={t("investment.occupancy")}
              suffix="%"
              value={occupancy}
              min={30}
              max={90}
              step={1}
              onChange={setOccupancy}
              format={(v) => `${v}%`}
            />

            <ul className="mt-8 text-xs text-white/60 space-y-1.5">
              <li>{t("investment.fixedOpex", { amount: formatCurrency(monthlyOpex, "USD", locale) })}</li>
              <li>{t("investment.mgmtFee", { percent: mgmtFee })}</li>
              <li>{t("investment.appreciation", { percent: appreciation })}</li>
            </ul>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <ProjectionCard
              label={t("investment.investmentPrice")}
              value={formatCurrency(price, development.currency, locale)}
              tone="accent"
            />
            <ProjectionCard
              label={t("investment.grossAnnual")}
              value={formatCurrency(projection.grossAnnual, "USD", locale)}
              sub={`${projection.grossYield.toFixed(1)}% ${t("investment.grossYield")}`}
            />
            <ProjectionCard
              label={t("investment.netAnnual")}
              value={formatCurrency(projection.netAnnual, "USD", locale)}
              sub={`${projection.netYield.toFixed(1)}% ${t("investment.netYield")}`}
            />
            <ProjectionCard
              label={t("investment.appreciationYear")}
              value={formatCurrency(projection.appreciationYear, "USD", locale)}
              sub={`${appreciation}% ${t("investment.annual")}`}
            />
            <div className="col-span-2 bg-primary p-8">
              <p className="text-eyebrow text-white/70 mb-2">{t("investment.totalReturnYear")}</p>
              <p className="font-display text-4xl md:text-5xl leading-none">
                {formatCurrency(projection.totalReturn, "USD", locale)}
              </p>
              <p className="text-sm text-white/75 mt-2">
                {t("investment.totalReturnSub", { percent: projection.totalReturnPct.toFixed(1) })}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/50 max-w-3xl leading-relaxed">
          {tDev.text(development.investment.notes, locale)}
        </p>
      </div>
    </section>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  suffix?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs uppercase tracking-wide text-white/60">{label}</label>
        <span className="font-display text-xl text-white tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}

function ProjectionCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "accent";
}) {
  const bg = tone === "accent" ? "bg-white/[0.06] border-accent/40" : "bg-white/[0.03] border-white/10";
  return (
    <div className={`border ${bg} p-6`}>
      <p className="text-eyebrow text-white/60 mb-3">{label}</p>
      <p className="font-display text-2xl md:text-3xl leading-none tabular-nums">{value}</p>
      {sub && <p className="text-xs text-white/60 mt-2">{sub}</p>}
    </div>
  );
}
