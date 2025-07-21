import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "No token provided" });

  // (Можешь добавить проверку токена через firebase-admin здесь)

  setCookie({ res }, "token", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 5, // 5 дней
    sameSite: "lax",
  });

  return res.status(200).json({ status: "ok" });
}
