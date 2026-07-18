"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { development, t as tDev, OwnershipGoal } from "@/data/development";
import { siteConfig } from "@/config/siteConfig";
import SectionHeader from "./SectionHeader";

const BUDGET_RANGES = [
  { key: "u-500k", labelUSD: "< $500K USD" },
  { key: "500k-1m", labelUSD: "$500K – $1M USD" },
  { key: "1m-1.5m", labelUSD: "$1M – $1.5M USD" },
  { key: "1.5m+", labelUSD: "$1.5M+ USD" },
];

const TIMING = ["immediate", "1-3mo", "3-6mo", "6mo+"] as const;

export default function LeadCaptureSection() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    goal: "invest" as OwnershipGoal,
    budget: "",
    modelInterest: "",
    timing: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.whatsapp.trim()) {
      setError(t("leadCapture.required"));
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t("leadCapture.invalidEmail"));
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "landing-form",
          intent: "full-info",
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setError(t("leadCapture.sendError"));
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="relative py-24 md:py-32 bg-primary text-white">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={t("leadCapture.eyebrow")}
              heading={t("leadCapture.heading")}
              intro={t("leadCapture.intro", { name: development.name })}
              invert
            />

            <div className="mt-12 space-y-6">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  t("leadCapture.whatsappDefault", { name: development.name })
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-lg group-hover:bg-white/20 transition-colors">
                  ✆
                </span>
                <div>
                  <p className="text-eyebrow text-white/60">WhatsApp</p>
                  <p className="font-display text-lg">{siteConfig.phone}</p>
                </div>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group">
                <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-lg group-hover:bg-white/20 transition-colors">
                  @
                </span>
                <div>
                  <p className="text-eyebrow text-white/60">Email</p>
                  <p className="font-display text-lg">{siteConfig.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  ⌂
                </span>
                <div>
                  <p className="text-eyebrow text-white/60">{t("leadCapture.showroom")}</p>
                  <p className="font-display text-lg">{tDev.text(development.location.address, locale)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={submit} className="bg-white text-ink p-8 lg:p-12">
              {status === "success" ? (
                <div className="text-center py-12">
                  <p className="text-eyebrow text-primary mb-4">{t("leadCapture.successEyebrow")}</p>
                  <p className="font-display text-3xl leading-tight mb-4">
                    {t("leadCapture.successHeading", { name: form.name.split(" ")[0] || t("leadCapture.you") })}
                  </p>
                  <p className="text-ink/70 max-w-md mx-auto">{t("leadCapture.successBody")}</p>
                </div>
              ) : (
                <>
                  <p className="text-eyebrow text-primary mb-6">{t("leadCapture.formEyebrow")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Field label={t("leadCapture.name")} required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                        required
                      />
                    </Field>
                    <Field label={t("leadCapture.email")} required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                        required
                      />
                    </Field>
                    <Field label={t("leadCapture.whatsapp")} required>
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent"
                        required
                      />
                    </Field>
                    <Field label={t("leadCapture.timing")}>
                      <select
                        value={form.timing}
                        onChange={(e) => update("timing", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent text-ink"
                      >
                        <option value="">—</option>
                        {TIMING.map((k) => (
                          <option key={k} value={k}>
                            {t(`leadCapture.timings.${k}`)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wide text-ink/60 mb-3">{t("leadCapture.goalLabel")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["live", "invest", "both"] as OwnershipGoal[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => update("goal", g)}
                          className={`py-2.5 text-xs uppercase tracking-wide border transition-colors ${
                            form.goal === g
                              ? "border-primary bg-primary text-white"
                              : "border-ink/20 text-ink/70 hover:border-ink/40"
                          }`}
                        >
                          {t(`leadCapture.goals.${g}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Field label={t("leadCapture.budget")}>
                      <select
                        value={form.budget}
                        onChange={(e) => update("budget", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent text-ink"
                      >
                        <option value="">—</option>
                        {BUDGET_RANGES.map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.labelUSD}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t("leadCapture.modelInterest")}>
                      <select
                        value={form.modelInterest}
                        onChange={(e) => update("modelInterest", e.target.value)}
                        className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent text-ink"
                      >
                        <option value="">—</option>
                        {development.models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {tDev.text(m.name, locale)}
                          </option>
                        ))}
                        <option value="unsure">{t("leadCapture.modelUnsure")}</option>
                      </select>
                    </Field>
                  </div>

                  <Field label={t("leadCapture.message")}>
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={3}
                      className="w-full border-b border-ink/20 focus:border-primary focus:outline-none py-2 bg-transparent resize-none"
                    />
                  </Field>

                  {status === "error" && error && (
                    <p className="text-xs text-red-600 mt-4">{error}</p>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-ink/50 max-w-sm">{t("leadCapture.disclaimer")}</p>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="bg-ink text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-primary transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {status === "loading" ? t("leadCapture.sending") : t("leadCapture.submit")}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-ink/60 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
