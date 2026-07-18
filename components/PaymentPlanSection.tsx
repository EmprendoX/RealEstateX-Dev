"use client";

import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev } from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionHeader from "./SectionHeader";

export default function PaymentPlanSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const plan = development.paymentPlan;

  const steps = [
    {
      label: t("payment.reservation"),
      valueMain: formatCurrency(plan.reservation.amount, plan.reservation.currency, locale),
      valueSub: null,
      note: tDev.text(plan.reservation.note, locale),
    },
    {
      label: t("payment.downPayment"),
      valueMain: `${plan.downPayment.percent}%`,
      valueSub: t("payment.percentOfPrice"),
      note: tDev.text(plan.downPayment.note, locale),
    },
    {
      label: t("payment.installments"),
      valueMain: `${plan.installments.percentTotal}%`,
      valueSub: t("payment.acrossMonths", { count: plan.installments.count }),
      note: tDev.text(plan.installments.note, locale),
    },
    {
      label: t("payment.onDelivery"),
      valueMain: `${plan.onDelivery.percent}%`,
      valueSub: t("payment.percentOfPrice"),
      note: tDev.text(plan.onDelivery.note, locale),
    },
  ];

  return (
    <section id="plan-de-pagos" className="relative py-24 md:py-32 bg-surface text-ink">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow={t("payment.eyebrow")}
          heading={t("payment.heading")}
          intro={t("payment.intro")}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white border border-ink/10 p-6 min-h-[220px] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-lg text-primary tabular-nums">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-eyebrow text-ink/60">{s.label}</span>
              </div>
              <p className="font-display text-3xl md:text-4xl leading-none mb-1 tabular-nums">
                {s.valueMain}
              </p>
              {s.valueSub && <p className="text-xs text-ink/60 mb-4">{s.valueSub}</p>}
              <p className="mt-auto text-xs text-ink/70 leading-relaxed">{s.note}</p>
            </div>
          ))}
        </div>

        {plan.cashDiscount && (
          <div className="mt-12 bg-ink text-white p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="lg:flex-1">
              <p className="text-eyebrow text-accent mb-2">{t("payment.cashDiscountEyebrow")}</p>
              <p className="font-display text-3xl md:text-4xl leading-tight">
                {t("payment.cashDiscountHeading", { percent: plan.cashDiscount.percent })}
              </p>
              <p className="text-sm text-white/70 mt-3">{tDev.text(plan.cashDiscount.note, locale)}</p>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 bg-accent text-ink px-6 py-3 text-sm uppercase tracking-wide hover:bg-white transition-colors whitespace-nowrap"
            >
              {t("payment.cashDiscountCta")} →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
