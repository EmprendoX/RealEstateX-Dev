import type { NextApiRequest, NextApiResponse } from "next";
import { clearAuthCookie } from "@/utils/adminAuth";

interface LogoutResponse {
  ok: boolean;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Método no permitido",
    });
  }

  try {
    clearAuthCookie(res);
    return res.status(200).json({
      ok: true,
      message: "Sesión cerrada",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
}


