import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { requireAuth } from "@/utils/adminAuth";
import { writeJsonAtomic } from "@/utils/adminFileWriter";
import type { Development } from "@/data/development";

const DEV_PATH = path.join(process.cwd(), "data", "development.json");

// Only these top-level keys are editable via THIS endpoint. Nested subtrees
// (models, units, amenities, concept, location, paymentPlan, investment,
// construction, developer) each have their own dedicated PATCH endpoint —
// prevents an accidental overwrite of the whole file with a partial payload.
const ALLOWED_KEYS: Array<keyof Development> = [
  "slug",
  "name",
  "tagline",
  "heroHeadline",
  "heroPoints",
  "intro",
  "currency",
  "status",
  "deliveryDate",
  "totalUnits",
  "heroImages",
  "heroVideoUrl",
  "galleryImages",
  "virtualTourUrl",
  "virtualTourProvider",
  "brochureUrl",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAuth(req, res)) return;
  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  const body = req.body as Partial<Development>;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, message: "Body inválido" });
  }

  const current = JSON.parse(fs.readFileSync(DEV_PATH, "utf-8")) as Development;

  const patch: Partial<Development> = {};
  for (const k of ALLOWED_KEYS) {
    if (Object.prototype.hasOwnProperty.call(body, k)) {
      const v = body[k];
      // Empty-string optionals get stripped (heroVideoUrl, virtualTourUrl, brochureUrl, logoUrl…)
      if (v === "" || v === null || v === undefined) {
        patch[k] = undefined as any;
      } else {
        patch[k] = v as any;
      }
    }
  }

  // Basic validation for the required fields we actually touch
  if (patch.name !== undefined && typeof patch.name !== "string") {
    return res.status(400).json({ ok: false, message: "name debe ser string" });
  }
  if (patch.totalUnits !== undefined && typeof patch.totalUnits !== "number") {
    return res.status(400).json({ ok: false, message: "totalUnits debe ser number" });
  }
  if (patch.currency !== undefined && !["USD", "MXN"].includes(patch.currency as string)) {
    return res.status(400).json({ ok: false, message: "currency debe ser USD o MXN" });
  }

  const next: Development = { ...current, ...patch };
  // strip explicit undefineds so they don't linger in JSON
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined) delete (next as any)[k];
  }

  const result = writeJsonAtomic(DEV_PATH, next);
  if (!result.ok) {
    return res.status(500).json({ ok: false, code: result.code, message: result.message });
  }
  return res.status(200).json({ ok: true, bytes: result.bytes });
}
