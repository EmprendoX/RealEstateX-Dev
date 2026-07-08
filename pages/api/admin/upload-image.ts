import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/utils/adminAuth";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable the automatic body parsing
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
  // Check authentication
  if (!requireAuth(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    // Create directory if it does not exist
    const uploadDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse the form
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
        message: "No file was provided",
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
      // Delete file if it is not valid
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
      return res.status(400).json({
        ok: false,
        message: "File type not allowed. Only images are allowed (JPG, PNG, WEBP, GIF)",
      });
    }

    // Generate a unique name
    const timestamp = Date.now();
    const originalName = file.originalFilename || "image";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, "-");
    const newFileName = `${baseName}-${timestamp}${extension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Move file to the final destination
    if (fs.existsSync(file.filepath)) {
      fs.renameSync(file.filepath, newFilePath);
    } else {
      return res.status(500).json({
        ok: false,
        message: "Error processing the file",
      });
    }

    // Return relative URL
    const imageUrl = `/images/${newFileName}`;

    return res.status(200).json({
      ok: true,
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      ok: false,
      message: "Error uploading the image",
    });
  }
}

