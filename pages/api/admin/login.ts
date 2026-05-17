import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, setAuthCookie } from "@/utils/adminAuth";

interface LoginRequest {
  password: string;
}

interface LoginResponse {
  ok: boolean;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Método no permitido",
    });
  }

  try {
    const { password }: LoginRequest = req.body;

    if (!password) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña es requerida",
      });
    }

    if (verifyPassword(password)) {
      setAuthCookie(res);
      return res.status(200).json({
        ok: true,
        message: "Login exitoso",
      });
    } else {
      return res.status(401).json({
        ok: false,
        message: "Contraseña incorrecta",
      });
    }
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
}


