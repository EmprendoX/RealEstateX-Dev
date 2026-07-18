"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev, getUnitsByModel } from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import { openDossier } from "@/utils/dossier";
import SectionHeader from "./SectionHeader";

type ScenarioKey = "conservative" | "base" | "optimistic";

interface Scenario {
  key: ScenarioKey;
  adr: number;
  occupancy: number;
}

const SCENARIOS: Scenario[] = [
  { key: "conservative", adr: 350, occupancy: 45 },
  { key: "base", adr: 430, occupancy: 58 },
  { key: "optimistic", adr: 520, occupancy: 68 },
];

export default function InvestmentSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const [modelId, setModelId] = useState<string>(
    development.models[1]?.id || development.models[0].id
  );
  const model = development.models.find((m) => m.id === modelId) || development.models[0];
  const modelUnits = getUnitsByModel(development, model.id);
  const anchorUnit = modelUnits.find((u) => u.status === "available") || modelUnits[0];
  const price = anchorUnit?.price ?? model.priceFrom;

  const monthlyOpex = development.investment.monthlyOperatingCostUSD;
  const mgmtFee = development.investment.managementFeePercent;
  const appreciation = development.investment.annualAppreciationPercent;

  const scenarios = useMemo(() => {
    return SCENARIOS.map((s) => {
      const grossAnnual = s.adr * (s.occupancy / 100) * 365;
      const mgmtCost = grossAnnual * (mgmtFee / 100);
      const opexAnnual = monthlyOpex * 12;
      const netAnnual = grossAnnual - mgmtCost - opexAnnual;
      const grossYield = (grossAnnual / price) * 100;
      const netYield = (netAnnual / price) * 100;
      const appreciationYear = price * (appreciation / 100);
      const totalReturn = netAnnual + appreciationYear;
      const totalReturnPct = (totalReturn / price) * 100;
      return { ...s, grossAnnual, netAnnual, grossYield, netYield, appreciationYear, totalReturn, totalReturnPct };
    });
  }, [price, mgmtFee, appreciation, monthlyOpex]);

  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <section id="inversion" className="relative py-24 md:py-32 bg-ink text-white">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("investment.eyebrow")}
          heading={t("investment.heading")}
          intro={t("investment.intro")}
          invert
        />

        {/* Methodology block — before numbers */}
        <div className="mt-12 max-w-3xl border-l-2 border-accent pl-6 py-2">
          <p className="text-eyebrow text-accent mb-3">{t("investment.methodologyLabel")}</p>
          <p className="text-sm text-white/75 leading-relaxed">
            {t("investment.methodologyBody")}
          </p>
        </div>

        {/* Model selector */}
        <div className="mt-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <p className="text-eyebrow text-white/60 mb-3">{t("investment.selectModel")}</p>
            <div className="flex flex-wrap gap-2">
              {development.models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelId(m.id)}
                  className={`text-xs uppercase tracking-eyebrow px-3 py-1.5 border transition-colors ${
                    m.id === modelId
                      ? "border-accent bg-accent text-ink"
                      : "border-white/20 text-white/70 hover:border-white/50"
                  }`}
                >
                  {tDev.text(m.name, locale)}
                </button>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-eyebrow text-white/60 mb-2">{t("investment.investmentPrice")}</p>
            <p className="font-display text-3xl md:text-4xl leading-none tabular-nums">
              {formatCurrency(price, development.currency, locale)}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {anchorUnit ? `${t("investment.basedOnUnit")} ${anchorUnit.id}` : ""}
            </p>
          </div>
        </div>

        {/* Scenarios table */}
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="pb-6 pr-4"></th>
                {scenarios.map((s) => {
                  const isBase = s.key === "base";
                  return (
                    <th
                      key={s.key}
                      className={`pb-6 px-4 text-left align-bottom ${
                        isBase ? "bg-white/5" : ""
                      }`}
                    >
                      <p className={`text-eyebrow mb-2 ${isBase ? "text-accent" : "text-white/50"}`}>
                        {t(`investment.scenarios.${s.key}`)}
                        {isBase && (
                          <span className="ml-2 text-[10px] normal-case tracking-normal text-white/60">
                            · {t("investment.baseTag")}
                          </span>
                        )}
                      </p>
                      <p className={`font-display text-2xl md:text-3xl leading-none ${isBase ? "text-white" : "text-white/70"}`}>
                        {s.occupancy}% <span className="text-sm text-white/40">·</span>{" "}
                        {formatCurrency(s.adr, "USD", locale)}
                      </p>
                      <p className="text-[10px] text-white/50 mt-1 uppercase tracking-eyebrow">
                        {t("investment.occLabel")} · ADR
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <Row
                label={t("investment.grossAnnual")}
                scenarios={scenarios}
                cell={(s) => formatCurrency(s.grossAnnual, "USD", locale)}
                sub={(s) => `${s.grossYield.toFixed(1)}% ${t("investment.grossYield")}`}
              />
              <Row
                label={t("investment.netAnnual")}
                scenarios={scenarios}
                cell={(s) => formatCurrency(s.netAnnual, "USD", locale)}
                sub={(s) => `${s.netYield.toFixed(1)}% ${t("investment.netYield")}`}
              />
              <Row
                label={t("investment.appreciationYear")}
                scenarios={scenarios}
                cell={(s) => formatCurrency(s.appreciationYear, "USD", locale)}
                sub={() => `${appreciation}% ${t("investment.annual")}`}
              />
              <Row
                label={t("investment.totalReturnYear")}
                scenarios={scenarios}
                cell={(s) => formatCurrency(s.totalReturn, "USD", locale)}
                sub={(s) => `${s.totalReturnPct.toFixed(1)}% ${t("investment.overInvestment")}`}
                emphasize
              />
            </tbody>
          </table>
        </div>

        {/* Fixed assumptions footnote */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/55">
          <div>
            <p className="text-eyebrow text-white/40 mb-1">{t("investment.fixedOpexLabel")}</p>
            <p>{formatCurrency(monthlyOpex, "USD", locale)} / {t("investment.month")}</p>
          </div>
          <div>
            <p className="text-eyebrow text-white/40 mb-1">{t("investment.mgmtFeeLabel")}</p>
            <p>{mgmtFee}% {t("investment.ofRevenue")}</p>
          </div>
          <div>
            <p className="text-eyebrow text-white/40 mb-1">{t("investment.appreciationLabel")}</p>
            <p>{appreciation}% {t("investment.annual")}</p>
          </div>
        </div>

        {/* Advanced — customize your own assumptions */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-eyebrow text-white/70 hover:text-white transition-colors"
          >
            {advancedOpen ? t("investment.hideAdvanced") : t("investment.showAdvanced")}
            <span className={`transition-transform duration-300 ${advancedOpen ? "rotate-180" : ""}`}>↓</span>
          </button>

          {advancedOpen && <AdvancedInputs price={price} locale={locale} t={t} />}
        </div>

        {/* Dossier gate */}
        <div className="mt-12 bg-white/[0.04] border border-white/10 p-8 lg:p-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="text-eyebrow text-accent mb-2">{t("investment.dossierGateEyebrow")}</p>
            <p className="font-display text-2xl md:text-3xl leading-tight">
              {t("investment.dossierGateHeading")}
            </p>
            <p className="text-sm text-white/60 mt-3 max-w-xl">
              {t("investment.dossierGateBody")}
            </p>
          </div>
          <button
            type="button"
            onClick={openDossier}
            className="inline-flex items-center gap-2 bg-accent text-ink px-6 py-3.5 text-xs uppercase tracking-eyebrow hover:bg-white transition-colors whitespace-nowrap"
          >
            {t("investment.dossierGateCta")} →
          </button>
        </div>

        {/* Legal note */}
        <p className="mt-8 text-xs text-white/50 max-w-3xl leading-relaxed">
          {tDev.text(development.investment.notes, locale)}
        </p>
      </div>
    </section>
  );
}

function Row({
  label,
  scenarios,
  cell,
  sub,
  emphasize = false,
}: {
  label: string;
  scenarios: Array<{ key: ScenarioKey } & Record<string, any>>;
  cell: (s: any) => string;
  sub?: (s: any) => string;
  emphasize?: boolean;
}) {
  return (
    <tr>
      <td className="py-5 pr-4 text-xs uppercase tracking-eyebrow text-white/60 align-top">
        {label}
      </td>
      {scenarios.map((s) => {
        const isBase = s.key === "base";
        return (
          <td
            key={s.key}
            className={`py-5 px-4 align-top ${isBase ? "bg-white/5" : ""}`}
          >
            <p
              className={`font-display leading-none tabular-nums ${
                emphasize ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
              } ${isBase ? "text-white" : "text-white/75"}`}
            >
              {cell(s)}
            </p>
            {sub && (
              <p className="text-[11px] text-white/50 mt-2 uppercase tracking-wide">
                {sub(s)}
              </p>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function AdvancedInputs({
  price,
  locale,
  t,
}: {
  price: number;
  locale?: string;
  t: (k: string, o?: any) => string;
}) {
  const [adr, setAdr] = useState<number>(development.investment.averageDailyRateUSD);
  const [occupancy, setOccupancy] = useState<number>(development.investment.occupancyPercent);
  const mgmtFee = development.investment.managementFeePercent;
  const monthlyOpex = development.investment.monthlyOperatingCostUSD;
  const appreciation = development.investment.annualAppreciationPercent;

  const p = useMemo(() => {
    const gross = adr * (occupancy / 100) * 365;
    const mgmt = gross * (mgmtFee / 100);
    const opex = monthlyOpex * 12;
    const net = gross - mgmt - opex;
    const appYear = price * (appreciation / 100);
    return {
      gross,
      net,
      netYield: (net / price) * 100,
      appYear,
      total: net + appYear,
      totalPct: ((net + appYear) / price) * 100,
    };
  }, [adr, occupancy, price, mgmtFee, monthlyOpex, appreciation]);

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-up">
      <div>
        <SliderRow
          label={t("investment.adr")}
          value={adr}
          min={200}
          max={900}
          step={10}
          onChange={setAdr}
          display={formatCurrency(adr, "USD", locale)}
        />
        <SliderRow
          label={t("investment.occupancy")}
          value={occupancy}
          min={30}
          max={90}
          step={1}
          onChange={setOccupancy}
          display={`${occupancy}%`}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MiniStat label={t("investment.netAnnual")} value={formatCurrency(p.net, "USD", locale)} sub={`${p.netYield.toFixed(1)}% ${t("investment.netYield")}`} />
        <MiniStat label={t("investment.appreciationYear")} value={formatCurrency(p.appYear, "USD", locale)} sub={`${appreciation}% ${t("investment.annual")}`} />
        <div className="col-span-2 bg-primary p-6">
          <p className="text-eyebrow text-white/70 mb-2">{t("investment.totalReturnYear")}</p>
          <p className="font-display text-3xl md:text-4xl leading-none tabular-nums">
            {formatCurrency(p.total, "USD", locale)}
          </p>
          <p className="text-xs text-white/75 mt-2">
            {p.totalPct.toFixed(1)}% {t("investment.overInvestment")}
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs uppercase tracking-eyebrow text-white/60">{label}</label>
        <span className="font-display text-xl text-white tabular-nums">{display}</span>
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

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-white/10 p-5">
      <p className="text-eyebrow text-white/60 mb-3">{label}</p>
      <p className="font-display text-xl md:text-2xl leading-none tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-white/50 mt-2">{sub}</p>}
    </div>
  );
}
