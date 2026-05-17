import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "@/utils/adminAuth";

interface AuthCheckResponse {
  ok: boolean;
  authenticated: boolean;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthCheckResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      authenticated: false,
    });
  }

  const authenticated = checkAuth(req);
  return res.status(200).json({
    ok: true,
    authenticated,
  });
}


