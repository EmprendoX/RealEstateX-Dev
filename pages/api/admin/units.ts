import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { requireAuth } from "@/utils/adminAuth";
import { writeJsonAtomic } from "@/utils/adminFileWriter";
import type { Development, Unit, UnitStatus } from "@/data/development";

const DEV_PATH = path.join(process.cwd(), "data", "development.json");

const VALID_STATUS: UnitStatus[] = ["available", "reserved", "sold"];

function loadDev(): Development {
  return JSON.parse(fs.readFileSync(DEV_PATH, "utf-8")) as Development;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAuth(req, res)) return;

  // PATCH — partial update of a single unit (used by the status toggle grid)
  if (req.method === "PATCH") {
    const { unitId, patch } = req.body as { unitId?: string; patch?: Partial<Unit> };
    if (!unitId || !patch || typeof patch !== "object") {
      return res.status(400).json({ ok: false, message: "unitId y patch requeridos" });
    }
    if (patch.status && !VALID_STATUS.includes(patch.status)) {
      return res.status(400).json({ ok: false, message: `status inválido: ${patch.status}` });
    }
    const dev = loadDev();
    const idx = dev.units.findIndex((u) => u.id === unitId);
    if (idx === -1) {
      return res.status(404).json({ ok: false, message: `Unidad no encontrada: ${unitId}` });
    }
    dev.units[idx] = { ...dev.units[idx], ...patch, id: dev.units[idx].id };
    const result = writeJsonAtomic(DEV_PATH, dev);
    if (!result.ok) {
      return res.status(500).json({ ok: false, code: result.code, message: result.message });
    }
    return res.status(200).json({ ok: true, unit: dev.units[idx] });
  }

  // PUT — replace the full units array (used by add / delete / reorder flows)
  if (req.method === "PUT") {
    const { units } = req.body as { units?: Unit[] };
    if (!Array.isArray(units)) {
      return res.status(400).json({ ok: false, message: "units debe ser un array" });
    }
    // Basic validation on each unit
    for (const u of units) {
      if (!u.id || !u.modelId || typeof u.level !== "number" || typeof u.price !== "number") {
        return res.status(400).json({ ok: false, message: `Unidad inválida: ${JSON.stringify(u)}` });
      }
      if (!VALID_STATUS.includes(u.status)) {
        return res.status(400).json({ ok: false, message: `status inválido en ${u.id}` });
      }
    }
    // Ensure ids are unique
    const ids = units.map((u) => u.id);
    if (new Set(ids).size !== ids.length) {
      return res.status(400).json({ ok: false, message: "Hay IDs de unidad duplicados" });
    }
    const dev = loadDev();
    dev.units = units;
    const result = writeJsonAtomic(DEV_PATH, dev);
    if (!result.ok) {
      return res.status(500).json({ ok: false, code: result.code, message: result.message });
    }
    return res.status(200).json({ ok: true, count: units.length });
  }

  return res.status(405).json({ ok: false, message: "Método no permitido" });
}
