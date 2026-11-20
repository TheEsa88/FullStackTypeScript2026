import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AuthError } from "../errors.js";

// P2025 (record not found) -> 404, P2002 (unique) -> 409
export function prismaErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "NOT_FOUND" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: "CONFLICT" });
      return;
    }
  }
  next(err);
}

// AuthError -> 400, kaikki muu -> 500
export function generalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AuthError) {
    res.status(400).json({ error: "AUTH_ERROR", message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
