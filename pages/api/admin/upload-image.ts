import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/utils/adminAuth";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Deshabilitar el parseo automático del body
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  ok: boolean;
  message?: string;
  url?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  // Verificar autenticación
  if (!requireAuth(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Método no permitido",
    });
  }

  try {
    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parsear el formulario
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: false,
    });

    const [fields, files] = await form.parse(req);

    const fileArray = Array.isArray(files.image) ? files.image : files.image ? [files.image] : [];
    const file = fileArray[0];

    if (!file) {
      return res.status(400).json({
        ok: false,
        message: "No se proporcionó ningún archivo",
      });
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      // Eliminar archivo si no es válido
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
      return res.status(400).json({
        ok: false,
        message: "Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)",
      });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const originalName = file.originalFilename || "image";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, "-");
    const newFileName = `${baseName}-${timestamp}${extension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Mover archivo al destino final
    if (fs.existsSync(file.filepath)) {
      fs.renameSync(file.filepath, newFilePath);
    } else {
      return res.status(500).json({
        ok: false,
        message: "Error al procesar el archivo",
      });
    }

    // Retornar URL relativa
    const imageUrl = `/images/${newFileName}`;

    return res.status(200).json({
      ok: true,
      message: "Imagen subida exitosamente",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al subir la imagen",
    });
  }
}

