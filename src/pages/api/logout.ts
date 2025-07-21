import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  setCookie({ res }, "token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: -1, // Сразу удаляет куку
    sameSite: "lax",
  });

  res.status(200).json({ status: "logged out" });
}
