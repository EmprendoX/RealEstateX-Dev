import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/utils/adminAuth";
import { writeSiteConfig } from "@/utils/fileWriter";
import { SiteConfig } from "@/config/siteConfig";

interface ConfigResponse {
  ok: boolean;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConfigResponse>
) {
  // Verificar autenticación
  if (!requireAuth(req, res)) {
    return;
  }

  if (req.method !== "PUT") {
    return res.status(405).json({
      ok: false,
      message: "Método no permitido",
    });
  }

  try {
    const config: SiteConfig = req.body;

    // Validaciones básicas
    if (!config.siteName || !config.logoText || !config.brokerName) {
      return res.status(400).json({
        ok: false,
        message: "Campos requeridos faltantes",
      });
    }

    // Validar formato de colores hex
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(config.primaryColor)) {
      return res.status(400).json({
        ok: false,
        message: "Color primario inválido (debe ser formato hex)",
      });
    }
    if (!hexColorRegex.test(config.secondaryColor)) {
      return res.status(400).json({
        ok: false,
        message: "Color secundario inválido (debe ser formato hex)",
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(config.email)) {
      return res.status(400).json({
        ok: false,
        message: "Email inválido",
      });
    }

    // Guardar configuración
    writeSiteConfig(config);

    return res.status(200).json({
      ok: true,
      message: "Configuración guardada exitosamente",
    });
  } catch (error) {
    console.error("Error guardando configuración:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al guardar la configuración",
    });
  }
}


