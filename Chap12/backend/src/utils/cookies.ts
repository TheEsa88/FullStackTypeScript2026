import type { Response } from "express";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
});

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// Samat liput kuin yllä, mutta ilman maxAgea
export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie("refreshToken", cookieOptions());
}
