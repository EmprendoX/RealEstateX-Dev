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
  // Check authentication
  if (!requireAuth(req, res)) {
    return;
  }

  // GET - List all properties
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      properties,
      count: properties.length,
    });
  }

  // POST - Create new property
  if (req.method === "POST") {
    try {
      // Validate the limit of 22 properties
      if (properties.length >= MAX_PROPERTIES) {
        return res.status(400).json({
          ok: false,
          message: `You cannot add more than ${MAX_PROPERTIES} properties. You currently have ${properties.length}.`,
        });
      }

      const newProperty: Property = req.body;

      // Validations
      if (!newProperty.title || !newProperty.slug || !newProperty.description) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields (title, slug, description)",
        });
      }

      // Validate that the slug is unique
      if (properties.some((p) => p.slug === newProperty.slug)) {
        return res.status(400).json({
          ok: false,
          message: "A property with that slug already exists",
        });
      }

      // Validate that the ID is unique
      if (properties.some((p) => p.id === newProperty.id)) {
        return res.status(400).json({
          ok: false,
          message: "A property with that ID already exists",
        });
      }

      // Validate types
      if (!["venta", "renta"].includes(newProperty.type)) {
        return res.status(400).json({
          ok: false,
          message: "Type must be 'venta' or 'renta'",
        });
      }

      if (!["MXN", "USD"].includes(newProperty.currency)) {
        return res.status(400).json({
          ok: false,
          message: "Currency must be 'MXN' or 'USD'",
        });
      }

      // Validate numbers
      if (
        typeof newProperty.price !== "number" ||
        typeof newProperty.bedrooms !== "number" ||
        typeof newProperty.bathrooms !== "number" ||
        typeof newProperty.parking !== "number" ||
        typeof newProperty.area !== "number"
      ) {
        return res.status(400).json({
          ok: false,
          message: "Numeric fields must be valid numbers",
        });
      }

      // Add new property
      const updatedProperties = [...properties, newProperty];
      writeProperties(updatedProperties);

      return res.status(200).json({
        ok: true,
        message: "Property created successfully",
        property: newProperty,
        count: updatedProperties.length,
      });
    } catch (error) {
      console.error("Error creating property:", error);
      return res.status(500).json({
        ok: false,
        message: "Error creating the property",
      });
    }
  }

  return res.status(405).json({
    ok: false,
    message: "Method not allowed",
  });
}


