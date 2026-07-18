import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { requireAuth } from "@/utils/adminAuth";
import { writeJsonAtomic } from "@/utils/adminFileWriter";
import type { SiteConfig } from "@/config/siteConfig";

const CONFIG_PATH = path.join(process.cwd(), "config", "siteConfig.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAuth(req, res)) return;

  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  const body = req.body as Partial<SiteConfig>;

  // Minimal validation — required fields must be present and non-empty strings.
  const REQUIRED: Array<keyof SiteConfig> = [
    "siteName",
    "siteUrl",
    "logoText",
    "phone",
    "whatsapp",
    "email",
    "primaryColor",
    "accentColor",
    "inkColor",
    "surfaceColor",
    "displayFont",
    "bodyFont",
    "developerCompany",
  ];
  for (const k of REQUIRED) {
    if (!body[k] || typeof body[k] !== "string") {
      return res.status(400).json({ ok: false, message: `Campo requerido: ${k}` });
    }
  }

  // Normalize: strip empty-string optionals so they don't clutter the JSON.
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (v === "" || v === null || v === undefined) continue;
    cleaned[k] = v;
  }

  const result = writeJsonAtomic(CONFIG_PATH, cleaned);
  if (!result.ok) {
    return res.status(500).json({ ok: false, code: result.code, message: result.message });
  }

  return res.status(200).json({ ok: true, bytes: result.bytes });
}
