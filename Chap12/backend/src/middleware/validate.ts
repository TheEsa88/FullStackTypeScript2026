// Kirjassa: import type { ZodSchema } from 'zod';
// Zod 4:ssä ZodSchema on vanhentunut alias, joten käytetään ZodType-tyyppiä (sama asia).
import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        details: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
