import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

// Huom: secretit luetaan funktiokutsun hetkellä (ei moduulin latautuessa),
// jotta dotenv ehtii ladata .env-tiedoston ennen kuin niitä tarvitaan.
const accessSecret = () => new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const refreshSecret = () => new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function createAccessToken(userId: number, role: string): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret());
}

export async function createRefreshToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret());
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret());
  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshSecret());
  return payload;
}

export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
