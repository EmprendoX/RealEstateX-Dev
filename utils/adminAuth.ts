import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Contraseña por defecto (cambiar en producción)
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Verifica si el usuario está autenticado
 */
export function checkAuth(req: NextApiRequest): boolean {
  const session = req.cookies[COOKIE_NAME];
  return session === "authenticated";
}

/**
 * Requiere autenticación, retorna 401 si no está autenticado
 */
export function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (!checkAuth(req)) {
    res.status(401).json({ ok: false, message: "No autorizado" });
    return false;
  }
  return true;
}

/**
 * Crea una cookie de sesión
 */
export function setAuthCookie(res: NextApiResponse): void {
  const cookie = serialize(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
}

/**
 * Elimina la cookie de sesión
 */
export function clearAuthCookie(res: NextApiResponse): void {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
}

/**
 * Verifica la contraseña
 */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}


