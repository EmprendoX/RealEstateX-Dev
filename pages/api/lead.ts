import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { siteConfig } from "@/config/siteConfig";
import { development, getModelById } from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";

type OwnershipGoal = "live" | "invest" | "both";

interface LeadRequestBody {
  name?: string;
  email?: string;
  whatsapp?: string;
  goal?: OwnershipGoal;
  budget?: string;
  modelInterest?: string;
  timing?: string;
  message?: string;
  source?: string;   // "hero-inquiry" | "landing-form" | ...
  intent?: string;   // "info" | "full-info" | "brochure" | ...
  unit?: string;     // optional specific unit id
}

interface LeadResponse {
  ok: boolean;
  message: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function goalLabel(g: OwnershipGoal | undefined): string {
  if (g === "live") return "Vivir";
  if (g === "invest") return "Invertir";
  if (g === "both") return "Vivir + Invertir";
  return "—";
}

function timingLabel(t: string | undefined): string {
  if (!t) return "—";
  const map: Record<string, string> = {
    immediate: "Inmediato (< 1 mes)",
    "1-3mo": "1 – 3 meses",
    "3-6mo": "3 – 6 meses",
    "6mo+": "6+ meses",
  };
  return map[t] ?? t;
}

function modelLabel(id: string | undefined): string {
  if (!id) return "—";
  if (id === "unsure") return "Aún no decidido";
  const m = getModelById(development, id);
  return m ? m.name.es : id;
}

function buildEmailHtml(lead: Required<Omit<LeadRequestBody, "unit">> & { unit?: string; timestamp: string }): string {
  const rows: Array<[string, string]> = [
    ["Nombre", lead.name],
    ["Email", `<a href="mailto:${escapeHtml(lead.email)}" style="color: ${siteConfig.primaryColor};">${escapeHtml(lead.email)}</a>`],
    ["WhatsApp", lead.whatsapp || "—"],
    ["Objetivo", goalLabel(lead.goal)],
    ["Presupuesto", lead.budget || "—"],
    ["Modelo de interés", modelLabel(lead.modelInterest)],
    ["Timing", timingLabel(lead.timing)],
    ["Origen", `${lead.source} / ${lead.intent}`],
  ];
  if (lead.unit) rows.push(["Unidad específica", lead.unit]);
  if (lead.message) rows.push(["Mensaje", lead.message]);

  const body = rows
    .map(
      ([k, v]) => `
      <tr><td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em;">${k}</p>
        <p style="margin: 0; font-size: 15px; color: #111827; line-height: 1.5;">${v.startsWith("<") ? v : escapeHtml(v)}</p>
      </td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f5f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width: 560px; background:#ffffff;">
        <tr>
          <td style="background: ${siteConfig.primaryColor}; padding: 24px 32px;">
            <p style="margin: 0; color: #ffffff; font-size: 12px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.15em;">${escapeHtml(development.name)}</p>
            <h1 style="margin: 4px 0 0; color: #ffffff; font-size: 20px; font-weight: 500;">Nuevo lead</h1>
          </td>
        </tr>
        <tr><td style="padding: 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">${body}</table>
          <div style="margin-top: 24px; padding: 14px 16px; background: #f9fafb; border-left: 3px solid ${siteConfig.primaryColor};">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Respondé a este email para contactar al lead — su email ya está como Reply-To.</p>
          </div>
        </td></tr>
        <tr><td style="padding: 12px 32px 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">Recibido: ${new Date(lead.timestamp).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" })}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildEmailText(lead: LeadRequestBody & { timestamp: string }): string {
  const unit = lead.unit ? `\nUnidad: ${lead.unit}` : "";
  const message = lead.message ? `\n\nMensaje:\n${lead.message}` : "";
  return [
    `Nuevo lead en ${development.name}`,
    ``,
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp || "—"}`,
    `Objetivo: ${goalLabel(lead.goal)}`,
    `Presupuesto: ${lead.budget || "—"}`,
    `Modelo: ${modelLabel(lead.modelInterest)}`,
    `Timing: ${timingLabel(lead.timing)}`,
    `Origen: ${lead.source} / ${lead.intent}${unit}${message}`,
    ``,
    `Recibido: ${lead.timestamp}`,
  ].join("\n");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeadResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  try {
    const body: LeadRequestBody = req.body || {};

    if (!body.name?.trim() || !body.whatsapp?.trim()) {
      return res.status(400).json({
        ok: false,
        message: "Nombre y WhatsApp son obligatorios",
      });
    }

    // Email is optional in the hero mini-form but required in the full form.
    // We validate only when provided; the API layer stays permissive.
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return res.status(400).json({ ok: false, message: "Email no válido" });
    }

    const lead = {
      name: body.name.trim(),
      email: body.email?.trim() || "",
      whatsapp: body.whatsapp.trim(),
      goal: body.goal || "both",
      budget: body.budget || "",
      modelInterest: body.modelInterest || "",
      timing: body.timing || "",
      message: body.message?.trim() || "",
      source: body.source || "unknown",
      intent: body.intent || "info",
      unit: body.unit,
      timestamp: new Date().toISOString(),
    };

    // Always log — belt-and-suspenders in case email/webhook fail
    console.log("=== NEW LEAD ===");
    console.log(JSON.stringify(lead, null, 2));

    // 1) Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.LEAD_FROM_EMAIL || "onboarding@resend.dev";
      try {
        await resend.emails.send({
          from: `${development.name} <${fromEmail}>`,
          to: siteConfig.email,
          replyTo: lead.email || undefined,
          subject: `Nuevo lead: ${lead.name} — ${goalLabel(lead.goal)}${lead.unit ? ` (${lead.unit})` : ""}`,
          html: buildEmailHtml(lead as any),
          text: buildEmailText(lead),
        });
      } catch (err) {
        console.error("Resend error:", err);
        // Don't fail the response — the lead is logged.
      }
    } else {
      console.warn("RESEND_API_KEY not set — lead was not emailed.");
    }

    // 2) Webhook (optional)
    if (siteConfig.leadWebhookUrl) {
      try {
        await fetch(siteConfig.leadWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lead,
            developmentName: development.name,
            developmentSlug: development.slug,
            siteName: siteConfig.siteName,
            developerCompany: siteConfig.developerCompany,
            unitPrice: lead.unit
              ? formatCurrency(
                  development.units.find((u) => u.id === lead.unit)?.price || 0,
                  development.currency
                )
              : undefined,
          }),
        });
      } catch (err) {
        console.error("Webhook error:", err);
      }
    }

    return res.status(200).json({ ok: true, message: "Lead recibido" });
  } catch (err) {
    console.error("Lead endpoint error:", err);
    return res.status(500).json({ ok: false, message: "Error interno" });
  }
}
