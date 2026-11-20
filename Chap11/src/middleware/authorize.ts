import type { Request, Response, NextFunction } from "express";

// Ajetaan aina authenticate-middlewaren JÄLKEEN, joten req.user on olemassa
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedRoles.includes(req.user!.role)) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    next();
  };
}
