import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Default password (change in production)
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Checks whether the user is authenticated
 */
export function checkAuth(req: NextApiRequest): boolean {
  const session = req.cookies[COOKIE_NAME];
  return session === "authenticated";
}

/**
 * Requires authentication, returns 401 if not authenticated
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
 * Creates a session cookie
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
 * Removes the session cookie
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
 * Verifies the password
 */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}


