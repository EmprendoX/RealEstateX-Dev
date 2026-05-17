import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/utils/adminAuth";
import { writeProperties } from "@/utils/fileWriter";
import { properties, Property } from "@/data/properties";

interface PropertyResponse {
  ok: boolean;
  message?: string;
  property?: Property;
  count?: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertyResponse>
) {
  // Verificar autenticación
  if (!requireAuth(req, res)) {
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      ok: false,
      message: "ID de propiedad requerido",
    });
  }

  // PUT - Actualizar propiedad
  if (req.method === "PUT") {
    try {
      const updatedProperty: Property = req.body;

      // Validar que el ID coincida
      if (updatedProperty.id !== id) {
        return res.status(400).json({
          ok: false,
          message: "El ID de la propiedad no coincide",
        });
      }

      // Buscar la propiedad existente
      const propertyIndex = properties.findIndex((p) => p.id === id);
      if (propertyIndex === -1) {
        return res.status(404).json({
          ok: false,
          message: "Propiedad no encontrada",
        });
      }

      // Validar que el slug sea único (si cambió)
      if (
        updatedProperty.slug !== properties[propertyIndex].slug &&
        properties.some((p) => p.slug === updatedProperty.slug && p.id !== id)
      ) {
        return res.status(400).json({
          ok: false,
          message: "Ya existe otra propiedad con ese slug",
        });
      }

      // Validaciones
      if (!updatedProperty.title || !updatedProperty.slug || !updatedProperty.description) {
        return res.status(400).json({
          ok: false,
          message: "Campos requeridos faltantes",
        });
      }

      // Validar tipos
      if (!["venta", "renta"].includes(updatedProperty.type)) {
        return res.status(400).json({
          ok: false,
          message: "Tipo debe ser 'venta' o 'renta'",
        });
      }

      if (!["MXN", "USD"].includes(updatedProperty.currency)) {
        return res.status(400).json({
          ok: false,
          message: "Moneda debe ser 'MXN' o 'USD'",
        });
      }

      // Actualizar propiedad
      const updatedProperties = [...properties];
      updatedProperties[propertyIndex] = updatedProperty;
      writeProperties(updatedProperties);

      return res.status(200).json({
        ok: true,
        message: "Propiedad actualizada exitosamente",
        property: updatedProperty,
        count: updatedProperties.length,
      });
    } catch (error) {
      console.error("Error actualizando propiedad:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al actualizar la propiedad",
      });
    }
  }

  // DELETE - Borrar propiedad
  if (req.method === "DELETE") {
    try {
      const propertyIndex = properties.findIndex((p) => p.id === id);
      if (propertyIndex === -1) {
        return res.status(404).json({
          ok: false,
          message: "Propiedad no encontrada",
        });
      }

      // Eliminar propiedad
      const updatedProperties = properties.filter((p) => p.id !== id);
      writeProperties(updatedProperties);

      return res.status(200).json({
        ok: true,
        message: "Propiedad eliminada exitosamente",
        count: updatedProperties.length,
      });
    } catch (error) {
      console.error("Error eliminando propiedad:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar la propiedad",
      });
    }
  }

  return res.status(405).json({
    ok: false,
    message: "Método no permitido",
  });
}


