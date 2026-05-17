import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  propertiesCount?: string;
  notes?: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildHtml(data: ContactBody & { timestamp: string }): string {
  const row = (label: string, value: string | undefined) =>
    value && value.trim()
      ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.05em">${escapeHtml(label)}</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600">${escapeHtml(value)}</td></tr>`
      : "";

  return `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;padding:32px">
  <table style="max-width:520px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)">
    <tr><td style="background:#4f46e5;padding:20px 28px;color:white">
      <p style="margin:0;font-size:13px;opacity:.9">RealEstateX</p>
      <h1 style="margin:4px 0 0;font-size:20px">🎯 Nuevo prospecto</h1>
    </td></tr>
    <tr><td style="padding:24px 28px">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Nombre", data.name)}
        ${row("Email", data.email)}
        ${row("WhatsApp", data.phone)}
        ${row("Ciudad", data.city)}
        ${row("Propiedades", data.propertiesCount)}
        ${row("Notas", data.notes)}
      </table>
      <div style="margin-top:20px;padding:14px;background:#f3f4f6;border-radius:8px;font-size:13px;color:#6b7280">
        💡 Respondé a este email para contactar al prospecto directamente.
      </div>
    </td></tr>
    <tr><td style="padding:12px 28px 20px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
      Recibido el ${escapeHtml(new Date(data.timestamp).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" }))}
    </td></tr>
  </table>
</body></html>`;
}

function buildText(data: ContactBody & { timestamp: string }): string {
  return [
    "Nuevo prospecto en RealEstateX",
    "",
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `WhatsApp: ${data.phone}` : null,
    data.city ? `Ciudad: ${data.city}` : null,
    data.propertiesCount ? `Propiedades: ${data.propertiesCount}` : null,
    data.notes ? `\nNotas:\n${data.notes}` : null,
    "",
    `Recibido: ${data.timestamp}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  const body = req.body as ContactBody;

  if (!body?.name?.trim()) {
    return res.status(400).json({ ok: false, message: "Nombre requerido" });
  }
  if (!body?.email?.trim() || !EMAIL_REGEX.test(body.email)) {
    return res.status(400).json({ ok: false, message: "Email inválido" });
  }

  const data = {
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone?.trim() || "",
    city: body.city?.trim() || "",
    propertiesCount: body.propertiesCount?.trim() || "",
    notes: body.notes?.trim() || "",
    timestamp: new Date().toISOString(),
  };

  console.log("=== NUEVO PROSPECTO ===");
  console.log(JSON.stringify(data, null, 2));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL;

  if (apiKey && to) {
    const resend = new Resend(apiKey);
    const from = process.env.LEAD_FROM_EMAIL || "onboarding@resend.dev";

    try {
      const result = await resend.emails.send({
        from: `RealEstateX <${from}>`,
        to,
        replyTo: data.email,
        subject: `Nuevo prospecto: ${data.name}${data.city ? ` (${data.city})` : ""}`,
        html: buildHtml(data),
        text: buildText(data),
      });
      if (result.error) {
        console.error("Resend error:", result.error);
      }
    } catch (err) {
      console.error("Excepción enviando email:", err);
      // No fallar la respuesta al usuario
    }
  } else {
    console.warn(
      "RESEND_API_KEY o LEAD_EMAIL no configurados — el prospecto solo quedó en logs."
    );
  }

  return res.status(200).json({ ok: true, message: "Recibido" });
}
