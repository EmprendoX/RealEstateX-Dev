import type { NextApiRequest, NextApiResponse } from "next";
import {
  renderToStream,
  Document,
  Page,
  View,
  Text,
  Image as PdfImage,
  StyleSheet,
} from "@react-pdf/renderer";
import React from "react";
import { development, t as tDev, DevelopmentModel } from "@/data/development";
import { siteConfig } from "@/config/siteConfig";
import { formatCurrency } from "@/utils/formatCurrency";

// --------- copy per locale ---------

type Locale = "es" | "en";

const COPY = {
  es: {
    delivery: "Entrega",
    priceFrom: "Desde",
    residences: "residencias",
    concept: "El concepto",
    location: "Ubicación",
    minutes: "min",
    modelsHeading: "Modelos",
    priceLabel: "Desde",
    availabilityLabel: "Disponibilidad",
    unitsOf: "de",
    paymentHeading: "Plan de pagos",
    reservation: "Apartado",
    downPayment: "Enganche",
    installments: "Mensualidades",
    onDelivery: "Contra entrega",
    cashDiscount: "Descuento por pago de contado",
    investmentHeading: "Análisis de inversión",
    investmentColOcc: "Ocupación",
    investmentColAdr: "ADR (USD)",
    investmentColGross: "Ingreso bruto anual",
    investmentColNet: "Ingreso neto anual",
    investmentColTotal: "Retorno total año 1",
    investmentScenarios: {
      conservative: "Conservador",
      base: "Base",
      optimistic: "Optimista",
    },
    methodology: "Metodología",
    contactHeading: "Contacto",
    developer: "Desarrolladora",
    whatsapp: "WhatsApp",
    email: "Email",
    web: "Sitio web",
    disclaimer:
      "Documento de referencia. Precios y disponibilidad sujetos a actualización sin previo aviso. Las proyecciones de rendimiento son estimaciones basadas en comparables del mercado y no constituyen garantía.",
    page: "Página",
    of: "de",
  },
  en: {
    delivery: "Delivery",
    priceFrom: "From",
    residences: "residences",
    concept: "The concept",
    location: "Location",
    minutes: "min",
    modelsHeading: "Models",
    priceLabel: "From",
    availabilityLabel: "Availability",
    unitsOf: "of",
    paymentHeading: "Payment plan",
    reservation: "Reservation",
    downPayment: "Down payment",
    installments: "Monthly installments",
    onDelivery: "On delivery",
    cashDiscount: "Cash-payment discount",
    investmentHeading: "Investment analysis",
    investmentColOcc: "Occupancy",
    investmentColAdr: "ADR (USD)",
    investmentColGross: "Gross annual revenue",
    investmentColNet: "Net annual income",
    investmentColTotal: "Total return year 1",
    investmentScenarios: {
      conservative: "Conservative",
      base: "Base",
      optimistic: "Optimistic",
    },
    methodology: "Methodology",
    contactHeading: "Contact",
    developer: "Developer",
    whatsapp: "WhatsApp",
    email: "Email",
    web: "Website",
    disclaimer:
      "Reference document. Prices and availability subject to change without notice. Yield projections are estimates based on market comparables and are not guaranteed.",
    page: "Page",
    of: "of",
  },
} as const;

// --------- shared computed values ---------

const SCENARIOS = [
  { key: "conservative" as const, occupancy: 45, adr: 350 },
  { key: "base" as const, occupancy: 58, adr: 430 },
  { key: "optimistic" as const, occupancy: 68, adr: 520 },
];

// --------- PDF styles ---------

function makeStyles() {
  const primary = siteConfig.primaryColor;
  const ink = siteConfig.inkColor;
  const accent = siteConfig.accentColor;
  const surface = siteConfig.surfaceColor;

  return StyleSheet.create({
    page: {
      backgroundColor: "#FFFFFF",
      color: ink,
      fontFamily: "Helvetica",
      fontSize: 10,
      padding: 48,
      lineHeight: 1.5,
    },
    coverPage: {
      backgroundColor: ink,
      color: "#FFFFFF",
      padding: 0,
      position: "relative",
    },
    coverImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.55,
      objectFit: "cover",
    },
    coverOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: ink,
      opacity: 0.35,
    },
    coverContent: {
      position: "absolute",
      left: 48,
      right: 48,
      bottom: 60,
    },
    coverEyebrow: {
      fontSize: 9,
      color: "#FFFFFF",
      opacity: 0.9,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 20,
    },
    coverTitle: {
      fontFamily: "Times-Roman",
      fontSize: 64,
      lineHeight: 1,
      marginBottom: 24,
      letterSpacing: -1.5,
    },
    coverTagline: {
      fontFamily: "Times-Italic",
      fontSize: 18,
      lineHeight: 1.35,
      opacity: 0.9,
      marginBottom: 32,
      maxWidth: 380,
    },
    coverMeta: {
      fontSize: 10,
      opacity: 0.75,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    eyebrow: {
      fontSize: 8,
      color: primary,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    h2: {
      fontFamily: "Times-Roman",
      fontSize: 28,
      lineHeight: 1.15,
      marginBottom: 12,
      color: ink,
    },
    body: {
      fontSize: 10,
      lineHeight: 1.55,
      color: ink,
      opacity: 0.85,
    },
    sectionBlock: {
      marginBottom: 24,
    },
    distancesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    distanceRow: {
      width: "50%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      borderTopColor: "#e5e7eb",
      borderTopWidth: 0.5,
    },
    modelPage: {
      backgroundColor: "#FFFFFF",
      padding: 48,
    },
    modelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 20,
    },
    modelName: {
      fontFamily: "Times-Roman",
      fontSize: 36,
      lineHeight: 1,
      color: ink,
    },
    modelImage: {
      width: "100%",
      height: 260,
      objectFit: "cover",
      marginBottom: 20,
    },
    specsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 24,
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomColor: "#e5e7eb",
      borderBottomWidth: 0.5,
    },
    specItem: {
      fontSize: 9,
      color: ink,
      opacity: 0.75,
    },
    featureList: {
      marginTop: 8,
    },
    featureItem: {
      fontSize: 9,
      color: ink,
      opacity: 0.85,
      marginBottom: 4,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 20,
      paddingTop: 16,
      borderTopColor: "#e5e7eb",
      borderTopWidth: 0.5,
    },
    priceLabel: {
      fontSize: 8,
      color: ink,
      opacity: 0.5,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    priceValue: {
      fontFamily: "Times-Roman",
      fontSize: 24,
      color: primary,
      marginTop: 4,
    },
    paymentGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 20,
      gap: 12,
    },
    paymentBox: {
      width: "47%",
      padding: 16,
      borderColor: "#e5e7eb",
      borderWidth: 0.5,
      minHeight: 120,
    },
    paymentBoxLabel: {
      fontSize: 8,
      color: primary,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    paymentBoxValue: {
      fontFamily: "Times-Roman",
      fontSize: 22,
      color: ink,
      marginBottom: 4,
    },
    paymentBoxNote: {
      fontSize: 8,
      color: ink,
      opacity: 0.65,
      lineHeight: 1.4,
      marginTop: 8,
    },
    cashBox: {
      marginTop: 16,
      padding: 16,
      backgroundColor: ink,
    },
    cashText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontFamily: "Times-Roman",
    },
    cashSub: {
      color: "#FFFFFF",
      fontSize: 9,
      opacity: 0.75,
      marginTop: 4,
    },
    invTable: {
      marginTop: 16,
    },
    invRow: {
      flexDirection: "row",
      paddingVertical: 8,
      borderTopColor: "#e5e7eb",
      borderTopWidth: 0.5,
    },
    invRowHeader: {
      flexDirection: "row",
      paddingBottom: 8,
    },
    invCell: {
      flex: 1,
      fontSize: 9,
      color: ink,
    },
    invCellLabel: {
      flex: 1.4,
      fontSize: 8,
      color: ink,
      opacity: 0.6,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    invScenarioHeader: {
      fontFamily: "Times-Roman",
      fontSize: 12,
      color: ink,
    },
    invScenarioBase: {
      color: primary,
    },
    contactBlock: {
      marginTop: 20,
      paddingTop: 16,
      borderTopColor: ink,
      borderTopWidth: 1,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    contactLabel: {
      fontSize: 8,
      color: ink,
      opacity: 0.5,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    contactValue: {
      fontSize: 11,
      color: ink,
    },
    footer: {
      position: "absolute",
      bottom: 24,
      left: 48,
      right: 48,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 8,
      color: ink,
      opacity: 0.45,
    },
    disclaimer: {
      fontSize: 7,
      color: ink,
      opacity: 0.5,
      lineHeight: 1.5,
      marginTop: 24,
    },
  });
}

// --------- helpers ---------

function computeScenario(price: number, occupancy: number, adr: number) {
  const gross = adr * (occupancy / 100) * 365;
  const mgmt = gross * (development.investment.managementFeePercent / 100);
  const opex = development.investment.monthlyOperatingCostUSD * 12;
  const net = gross - mgmt - opex;
  const app = price * (development.investment.annualAppreciationPercent / 100);
  const total = net + app;
  return { gross, net, app, total };
}

function localizeDelivery(deliveryDate: string) {
  const [y, m] = deliveryDate.split("-");
  const q = Math.ceil(Number(m) / 3);
  return `Q${q} ${y}`;
}

// --------- PDF Document ---------

function BrochureDocument({ locale }: { locale: Locale }) {
  const s = makeStyles();
  const c = COPY[locale];
  const dev = development;
  const cheapestPrice = Math.min(...dev.models.map((m) => m.priceFrom));
  const anchorUnit =
    dev.units.find(
      (u) => u.status === "available" && u.modelId === dev.models[1]?.id
    ) || dev.units.find((u) => u.status === "available") || dev.units[0];
  const anchorPrice = anchorUnit?.price ?? cheapestPrice;

  return (
    <Document
      title={`${dev.name} — ${tDev.text(dev.tagline, locale)}`}
      author={siteConfig.developerCompany}
      creator={siteConfig.siteName}
    >
      {/* Cover */}
      <Page size="A4" style={s.coverPage}>
        <PdfImage src={dev.heroImages[0]} style={s.coverImage} />
        <View style={s.coverOverlay} />
        <View style={s.coverContent}>
          <Text style={s.coverEyebrow}>
            {dev.name.toUpperCase()} — {dev.location.state.toUpperCase()}
          </Text>
          <Text style={s.coverTitle}>{dev.name}</Text>
          <Text style={s.coverTagline}>{tDev.text(dev.heroHeadline, locale)}</Text>
          <Text style={s.coverMeta}>
            {c.priceFrom} {formatCurrency(cheapestPrice, dev.currency, locale)} · {dev.totalUnits} {c.residences} · {c.delivery} {localizeDelivery(dev.deliveryDate)}
          </Text>
        </View>
      </Page>

      {/* Concept + location */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionBlock}>
          <Text style={s.eyebrow}>{c.concept}</Text>
          <Text style={s.h2}>{tDev.text(dev.concept.heading, locale)}</Text>
          <Text style={s.body}>{tDev.text(dev.concept.body, locale)}</Text>
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.eyebrow}>{c.location}</Text>
          <Text style={s.h2}>{dev.location.city}, {dev.location.state}</Text>
          <Text style={s.body}>{tDev.text(dev.location.address, locale)}</Text>
          <View style={s.distancesGrid}>
            {dev.location.distances.map((d, i) => (
              <View key={i} style={s.distanceRow}>
                <Text style={{ fontSize: 9, color: siteConfig.inkColor }}>
                  {tDev.text(d.label, locale)}
                </Text>
                <Text style={{ fontSize: 9, color: siteConfig.primaryColor, fontFamily: "Times-Roman" }}>
                  {d.minutes} {c.minutes}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <PageFooter n={2} total={4 + dev.models.length} c={c} devName={dev.name} />
      </Page>

      {/* One page per model */}
      {dev.models.map((m, idx) => (
        <ModelPage key={m.id} model={m} idx={idx} totalPages={4 + dev.models.length} c={c} locale={locale} />
      ))}

      {/* Payment plan */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionBlock}>
          <Text style={s.eyebrow}>{c.paymentHeading}</Text>
          <Text style={s.h2}>
            {c.paymentHeading} — {dev.name}
          </Text>
        </View>

        <View style={s.paymentGrid}>
          {[
            {
              label: c.reservation,
              value: formatCurrency(dev.paymentPlan.reservation.amount, dev.paymentPlan.reservation.currency, locale),
              note: tDev.text(dev.paymentPlan.reservation.note, locale),
            },
            {
              label: c.downPayment,
              value: `${dev.paymentPlan.downPayment.percent}%`,
              note: tDev.text(dev.paymentPlan.downPayment.note, locale),
            },
            {
              label: c.installments,
              value: `${dev.paymentPlan.installments.percentTotal}% / ${dev.paymentPlan.installments.count}`,
              note: tDev.text(dev.paymentPlan.installments.note, locale),
            },
            {
              label: c.onDelivery,
              value: `${dev.paymentPlan.onDelivery.percent}%`,
              note: tDev.text(dev.paymentPlan.onDelivery.note, locale),
            },
          ].map((step, i) => (
            <View key={i} style={s.paymentBox}>
              <Text style={s.paymentBoxLabel}>{`${(i + 1).toString().padStart(2, "0")} · ${step.label}`}</Text>
              <Text style={s.paymentBoxValue}>{step.value}</Text>
              <Text style={s.paymentBoxNote}>{step.note}</Text>
            </View>
          ))}
        </View>

        {dev.paymentPlan.cashDiscount && (
          <View style={s.cashBox}>
            <Text style={s.cashText}>
              {c.cashDiscount} — {dev.paymentPlan.cashDiscount.percent}%
            </Text>
            <Text style={s.cashSub}>{tDev.text(dev.paymentPlan.cashDiscount.note, locale)}</Text>
          </View>
        )}

        {/* Investment scenarios */}
        <View style={{ marginTop: 32 }}>
          <Text style={s.eyebrow}>{c.investmentHeading}</Text>
          <Text style={{ ...s.body, marginTop: 4 }}>
            {tDev.text(development.investment.notes, locale)}
          </Text>

          <View style={s.invTable}>
            <View style={s.invRowHeader}>
              <Text style={s.invCellLabel}></Text>
              {SCENARIOS.map((sc) => (
                <Text
                  key={sc.key}
                  style={{
                    ...s.invCell,
                    ...(sc.key === "base" ? s.invScenarioBase : {}),
                    ...s.invScenarioHeader,
                  }}
                >
                  {c.investmentScenarios[sc.key]}
                </Text>
              ))}
            </View>

            {[
              { label: c.investmentColOcc, getValue: (sc: typeof SCENARIOS[number]) => `${sc.occupancy}%` },
              { label: c.investmentColAdr, getValue: (sc: typeof SCENARIOS[number]) => formatCurrency(sc.adr, "USD", locale) },
              { label: c.investmentColGross, getValue: (sc: typeof SCENARIOS[number]) => formatCurrency(computeScenario(anchorPrice, sc.occupancy, sc.adr).gross, "USD", locale) },
              { label: c.investmentColNet, getValue: (sc: typeof SCENARIOS[number]) => formatCurrency(computeScenario(anchorPrice, sc.occupancy, sc.adr).net, "USD", locale) },
              { label: c.investmentColTotal, getValue: (sc: typeof SCENARIOS[number]) => formatCurrency(computeScenario(anchorPrice, sc.occupancy, sc.adr).total, "USD", locale) },
            ].map((row, i) => (
              <View key={i} style={s.invRow}>
                <Text style={s.invCellLabel}>{row.label}</Text>
                {SCENARIOS.map((sc) => (
                  <Text
                    key={sc.key}
                    style={{
                      ...s.invCell,
                      ...(sc.key === "base" ? { color: siteConfig.primaryColor, fontFamily: "Times-Roman" } : {}),
                    }}
                  >
                    {row.getValue(sc)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        <PageFooter n={3 + dev.models.length} total={4 + dev.models.length} c={c} devName={dev.name} />
      </Page>

      {/* Contact + disclaimer */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionBlock}>
          <Text style={s.eyebrow}>{c.contactHeading}</Text>
          <Text style={s.h2}>{dev.name}</Text>
        </View>

        <View style={s.contactBlock}>
          <View style={s.contactRow}>
            <Text style={s.contactLabel}>{c.developer}</Text>
            <Text style={s.contactValue}>{siteConfig.developerCompany}</Text>
          </View>
          <View style={s.contactRow}>
            <Text style={s.contactLabel}>{c.whatsapp}</Text>
            <Text style={s.contactValue}>{siteConfig.phone}</Text>
          </View>
          <View style={s.contactRow}>
            <Text style={s.contactLabel}>{c.email}</Text>
            <Text style={s.contactValue}>{siteConfig.email}</Text>
          </View>
          <View style={s.contactRow}>
            <Text style={s.contactLabel}>{c.web}</Text>
            <Text style={s.contactValue}>{siteConfig.siteUrl}</Text>
          </View>
        </View>

        <Text style={s.disclaimer}>{c.disclaimer}</Text>

        <PageFooter n={4 + dev.models.length} total={4 + dev.models.length} c={c} devName={dev.name} />
      </Page>
    </Document>
  );
}

function ModelPage({
  model,
  idx,
  totalPages,
  c,
  locale,
}: {
  model: DevelopmentModel;
  idx: number;
  totalPages: number;
  c: typeof COPY[Locale];
  locale: Locale;
}) {
  const s = makeStyles();
  const available = development.units.filter((u) => u.modelId === model.id && u.status === "available").length;
  const total = development.units.filter((u) => u.modelId === model.id).length;
  const features = tDev.list(model.features, locale);

  return (
    <Page size="A4" style={s.modelPage}>
      <View style={s.modelHeader}>
        <View>
          <Text style={s.eyebrow}>
            {c.modelsHeading} — {(idx + 1).toString().padStart(2, "0")}
          </Text>
          <Text style={s.modelName}>{tDev.text(model.name, locale)}</Text>
        </View>
      </View>

      {model.renderImages[0] && <PdfImage src={model.renderImages[0]} style={s.modelImage} />}

      <View style={s.specsRow}>
        <Text style={s.specItem}>
          {model.bedrooms === 0 ? "Studio" : `${model.bedrooms} rec.`}
        </Text>
        <Text style={s.specItem}>{model.bathrooms} baños</Text>
        <Text style={s.specItem}>{model.area} m² int.</Text>
        {model.areaExterior != null && <Text style={s.specItem}>{model.areaExterior} m² ext.</Text>}
        {model.parking != null && <Text style={s.specItem}>{model.parking} estac.</Text>}
      </View>

      <Text style={s.body}>{tDev.text(model.description, locale)}</Text>

      {features.length > 0 && (
        <View style={s.featureList}>
          {features.map((f, i) => (
            <Text key={i} style={s.featureItem}>· {f}</Text>
          ))}
        </View>
      )}

      <View style={s.priceRow}>
        <View>
          <Text style={s.priceLabel}>{c.priceLabel}</Text>
          <Text style={s.priceValue}>
            {formatCurrency(model.priceFrom, development.currency, locale)}
          </Text>
        </View>
        <View>
          <Text style={s.priceLabel}>{c.availabilityLabel}</Text>
          <Text style={s.priceValue}>
            {available} {c.unitsOf} {total}
          </Text>
        </View>
      </View>

      <PageFooter n={2 + idx + 1} total={totalPages} c={c} devName={development.name} />
    </Page>
  );
}

function PageFooter({
  n,
  total,
  c,
  devName,
}: {
  n: number;
  total: number;
  c: typeof COPY[Locale];
  devName: string;
}) {
  const s = makeStyles();
  return (
    <View style={s.footer}>
      <Text>{devName} · {siteConfig.developerCompany}</Text>
      <Text>{c.page} {n} {c.of} {total}</Text>
    </View>
  );
}

// --------- API handler ---------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const langRaw = String(req.query.lang || "es").toLowerCase();
  const locale: Locale = langRaw === "en" ? "en" : "es";
  const filename = `${development.slug}-${locale}.pdf`;

  try {
    const stream = await renderToStream(<BrochureDocument locale={locale} />);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    // Default: inline (opens in browser). Use ?download=1 to force a Save dialog.
    const disposition = req.query.download ? "attachment" : "inline";
    res.setHeader("Content-Disposition", `${disposition}; filename="${filename}"`);
    (stream as any).pipe(res);
    (stream as any).on("end", () => res.end());
  } catch (err) {
    console.error("Brochure PDF error:", err);
    res.status(500).json({ ok: false, message: "Error generando el brochure" });
  }
}
