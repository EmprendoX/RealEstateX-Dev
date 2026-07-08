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
      message: "Method not allowed",
    });
  }

  try {
    clearAuthCookie(res);
    return res.status(200).json({
      ok: true,
      message: "Session closed",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}


