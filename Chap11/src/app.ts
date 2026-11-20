import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiters.js";
import { prismaErrorHandler, generalErrorHandler } from "./middleware/errorHandlers.js";

// Luku 11: app.ts vain RAKENTAA sovelluksen. Palvelin käynnistetään server.ts:ssä,
// jotta testit voivat importata appin (supertest) käynnistämättä porttia.
const app = express();

// "The complete middleware stack" - järjestyksellä on väliä:

// 1. Security headers (first, applies to all responses)
app.use(helmet());

// 2. Rate limiting (before parsing, reject early)
app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/refresh", authLimiter);

// 3. Body parsing (with size limit)
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 4. Routes (each router defines full paths; auth is applied per route)
app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);

// 5. Error handling (last)
app.use(prismaErrorHandler);
app.use(generalErrorHandler);

export default app;
