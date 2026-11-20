import rateLimit from "express-rate-limit";

// Yleinen: 100 pyyntöä / 15 min kaikille /api-reiteille
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Tiukka: 5 EPÄONNISTUNUTTA yritystä / 15 min (login, register, refresh)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
