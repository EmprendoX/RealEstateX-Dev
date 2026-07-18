"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  development,
  t as tDev,
  getModelById,
  absorptionPercent,
  availableUnitsCount,
  UnitStatus,
} from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import { openDossier } from "@/utils/dossier";
import SectionHeader from "./SectionHeader";

const STATUS_ORDER: UnitStatus[] = ["available", "reserved", "sold"];

export default function AvailabilitySection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("available");

  const filtered = useMemo(() => {
    return development.units.filter((u) => {
      if (modelFilter !== "all" && u.modelId !== modelFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [modelFilter, statusFilter]);

  const absorption = absorptionPercent(development);
  const available = availableUnitsCount(development);
  const total = development.units.length;

  function statusChip(status: UnitStatus) {
    if (status === "available")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-eyebrow text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {t("availability.statusAvailable")}
        </span>
      );
    if (status === "reserved")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-eyebrow text-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {t("availability.statusReserved")}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-eyebrow text-ink/40">
        <span className="w-1.5 h-1.5 rounded-full bg-ink/40" />
        {t("availability.statusSold")}
      </span>
    );
  }

  return (
    <section id="disponibilidad" className="relative py-24 md:py-32 bg-white text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("availability.eyebrow")}
          heading={t("availability.heading")}
          intro={t("availability.intro")}
        />

        {/* Summary card — always visible */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-y border-ink/10 py-12 lg:py-16">
          <div className="lg:col-span-4">
            <div className="flex items-baseline gap-4">
              <p className="font-display text-7xl lg:text-8xl leading-none text-primary tabular-nums">
                {available}
              </p>
              <p className="font-display text-3xl lg:text-4xl leading-none text-ink/30 tabular-nums">
                / {total}
              </p>
            </div>
            <p className="text-eyebrow text-ink/60 mt-4">{t("availability.unitsAvailable")}</p>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-ink/10 lg:pl-12">
            <p className="font-display text-5xl lg:text-6xl leading-none text-accent tabular-nums">
              {absorption}%
            </p>
            <p className="text-eyebrow text-ink/60 mt-4">{t("availability.absorbed")}</p>
            <p className="text-sm text-ink/60 mt-3 leading-relaxed max-w-xs">
              {t("availability.absorptionNote")}
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right space-y-3">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-3 bg-ink text-white px-6 py-3.5 text-xs uppercase tracking-eyebrow hover:bg-primary transition-colors"
            >
              {expanded ? t("availability.hideTable") : t("availability.expandTable")}
              <span className={`inline-block transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>↓</span>
            </button>
            <div>
              <button
                type="button"
                onClick={openDossier}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-ink/70 hover:text-primary transition-colors"
              >
                {t("availability.dossierCta")} →
              </button>
            </div>
          </div>
        </div>

        {/* Expandable table */}
        {expanded && (
          <div className="animate-fade-up mt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={modelFilter === "all"}
                  onClick={() => setModelFilter("all")}
                  label={t("availability.allModels")}
                />
                {development.models.map((m) => (
                  <FilterChip
                    key={m.id}
                    active={modelFilter === m.id}
                    onClick={() => setModelFilter(m.id)}
                    label={tDev.text(m.name, locale)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <FilterChip
                  active={statusFilter === "all"}
                  onClick={() => setStatusFilter("all")}
                  label={t("availability.allStatuses")}
                />
                {STATUS_ORDER.map((s) => (
                  <FilterChip
                    key={s}
                    active={statusFilter === s}
                    onClick={() => setStatusFilter(s)}
                    label={t(`availability.status${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border-t border-ink/10">
              <table className="w-full text-left text-sm">
                <thead className="text-eyebrow text-ink/50 border-b border-ink/10">
                  <tr>
                    <th className="py-3 pr-4">{t("availability.colUnit")}</th>
                    <th className="py-3 pr-4">{t("availability.colModel")}</th>
                    <th className="py-3 pr-4">{t("availability.colLevel")}</th>
                    <th className="py-3 pr-4">{t("availability.colOrientation")}</th>
                    <th className="py-3 pr-4 text-right">{t("availability.colArea")}</th>
                    <th className="py-3 pr-4 text-right">{t("availability.colPrice")}</th>
                    <th className="py-3 pr-4">{t("availability.colStatus")}</th>
                    <th className="py-3 pr-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-ink/50">
                        {t("availability.empty")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                      const model = getModelById(development, u.modelId);
                      const disabled = u.status === "sold";
                      return (
                        <tr key={u.id} className={disabled ? "opacity-60" : "hover:bg-surface/60"}>
                          <td className="py-4 pr-4 font-display text-lg">{u.id}</td>
                          <td className="py-4 pr-4">{model ? tDev.text(model.name, locale) : "—"}</td>
                          <td className="py-4 pr-4 tabular-nums">{u.level}</td>
                          <td className="py-4 pr-4 text-ink/70">
                            {u.orientation ? tDev.text(u.orientation, locale) : "—"}
                          </td>
                          <td className="py-4 pr-4 text-right tabular-nums">{u.area} m²</td>
                          <td className="py-4 pr-4 text-right font-display text-base tabular-nums">
                            {formatCurrency(u.price, development.currency, locale)}
                          </td>
                          <td className="py-4 pr-4">{statusChip(u.status)}</td>
                          <td className="py-4 pr-4 text-right">
                            {u.status === "available" ? (
                              <button
                                type="button"
                                onClick={openDossier}
                                className="text-primary text-xs uppercase tracking-eyebrow hover:underline"
                              >
                                {t("availability.quote")} →
                              </button>
                            ) : (
                              <span className="text-ink/30 text-xs uppercase tracking-eyebrow">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-xs text-ink/50">{t("availability.disclaimer")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs uppercase tracking-eyebrow px-3 py-1.5 border transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-ink/15 text-ink/70 hover:border-ink/40"
      }`}
    >
      {label}
    </button>
  );
}
