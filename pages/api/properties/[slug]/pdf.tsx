import type { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getPropertyBySlug } from "@/data/properties";
import { siteConfig } from "@/config/siteConfig";
import PropertyPDF from "@/components/pdf/PropertyPDF";

/**
 * GET /api/properties/[slug]/pdf
 *
 * Devuelve una ficha PDF de la propiedad lista para descargar / imprimir.
 * Es público (cualquier visitante puede generar el PDF de cualquier propiedad).
 */

function baseUrlFromRequest(req: NextApiRequest): string {
  // Preferir siteUrl configurado (URL canónica) si parece válido,
  // sino fallback a los headers del request — útil en preview deploys.
  if (siteConfig.siteUrl && /^https?:\/\//.test(siteConfig.siteUrl)) {
    return siteConfig.siteUrl.replace(/\/$/, "");
  }
  const proto =
    (req.headers["x-forwarded-proto"] as string | undefined) || "http";
  const host = (req.headers["x-forwarded-host"] || req.headers.host) as string;
  return `${proto}://${host}`;
}

function toAbsoluteImageUrl(src: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${baseUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  const slug = req.query.slug;
  if (typeof slug !== "string") {
    return res.status(400).json({ ok: false, message: "Slug inválido" });
  }

  const property = getPropertyBySlug(slug);
  if (!property) {
    return res.status(404).json({ ok: false, message: "Propiedad no encontrada" });
  }

  try {
    const baseUrl = baseUrlFromRequest(req);
    const propertyUrl = `${baseUrl}/properties/${property.slug}`;
    const absoluteImages = property.images.map((img) =>
      toAbsoluteImageUrl(img, baseUrl)
    );
    const generatedAt = new Date().toLocaleString("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const buffer = await renderToBuffer(
      <PropertyPDF
        property={property}
        siteConfig={siteConfig}
        propertyUrl={propertyUrl}
        images={absoluteImages}
        generatedAt={generatedAt}
      />
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${property.slug}.pdf"`
    );
    // El PDF refleja datos estáticos de la propiedad; podemos cachear unos minutos
    // en el CDN. ISR de la página detail también es de 60s, mantenemos en línea.
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
    return res.send(buffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al generar el PDF",
    });
  }
}
