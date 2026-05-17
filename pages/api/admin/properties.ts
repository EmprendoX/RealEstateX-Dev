import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/utils/adminAuth";
import { writeProperties } from "@/utils/fileWriter";
import { properties, Property, MAX_PROPERTIES } from "@/data/properties";

interface PropertiesResponse {
  ok: boolean;
  message?: string;
  properties?: Property[];
  property?: Property;
  count?: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertiesResponse>
) {
  // Verificar autenticación
  if (!requireAuth(req, res)) {
    return;
  }

  // GET - Listar todas las propiedades
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      properties,
      count: properties.length,
    });
  }

  // POST - Crear nueva propiedad
  if (req.method === "POST") {
    try {
      // Validar límite de 22 propiedades
      if (properties.length >= MAX_PROPERTIES) {
        return res.status(400).json({
          ok: false,
          message: `No se pueden agregar más de ${MAX_PROPERTIES} propiedades. Actualmente tienes ${properties.length}.`,
        });
      }

      const newProperty: Property = req.body;

      // Validaciones
      if (!newProperty.title || !newProperty.slug || !newProperty.description) {
        return res.status(400).json({
          ok: false,
          message: "Campos requeridos faltantes (title, slug, description)",
        });
      }

      // Validar que el slug sea único
      if (properties.some((p) => p.slug === newProperty.slug)) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe una propiedad con ese slug",
        });
      }

      // Validar que el ID sea único
      if (properties.some((p) => p.id === newProperty.id)) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe una propiedad con ese ID",
        });
      }

      // Validar tipos
      if (!["venta", "renta"].includes(newProperty.type)) {
        return res.status(400).json({
          ok: false,
          message: "Tipo debe ser 'venta' o 'renta'",
        });
      }

      if (!["MXN", "USD"].includes(newProperty.currency)) {
        return res.status(400).json({
          ok: false,
          message: "Moneda debe ser 'MXN' o 'USD'",
        });
      }

      // Validar números
      if (
        typeof newProperty.price !== "number" ||
        typeof newProperty.bedrooms !== "number" ||
        typeof newProperty.bathrooms !== "number" ||
        typeof newProperty.parking !== "number" ||
        typeof newProperty.area !== "number"
      ) {
        return res.status(400).json({
          ok: false,
          message: "Los campos numéricos deben ser números válidos",
        });
      }

      // Agregar nueva propiedad
      const updatedProperties = [...properties, newProperty];
      writeProperties(updatedProperties);

      return res.status(200).json({
        ok: true,
        message: "Propiedad creada exitosamente",
        property: newProperty,
        count: updatedProperties.length,
      });
    } catch (error) {
      console.error("Error creando propiedad:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al crear la propiedad",
      });
    }
  }

  return res.status(405).json({
    ok: false,
    message: "Método no permitido",
  });
}


