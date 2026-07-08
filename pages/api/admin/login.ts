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
      message: "Method not allowed",
    });
  }

  try {
    const { password }: LoginRequest = req.body;

    if (!password) {
      return res.status(400).json({
        ok: false,
        message: "Password is required",
      });
    }

    if (verifyPassword(password)) {
      setAuthCookie(res);
      return res.status(200).json({
        ok: true,
        message: "Login successful",
      });
    } else {
      return res.status(401).json({
        ok: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}


