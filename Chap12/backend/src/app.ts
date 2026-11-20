import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { apiLimiter, authLimiter, refreshLimiter } from "./middleware/rateLimiters.js";
import { prismaErrorHandler, generalErrorHandler } from "./middleware/errorHandlers.js";

// Luku 11: app.ts vain RAKENTAA sovelluksen. Palvelin käynnistetään server.ts:ssä,
// jotta testit voivat importata appin (supertest) käynnistämättä porttia.
const app = express();

// "The complete middleware stack" - järjestyksellä on väliä:

// 1. Security headers (first, applies to all responses)
app.use(helmet());

// Luku 12: CORS - Helmetin jälkeen, ennen rate limitingiä.
// credentials: true tarvitaan, jotta refresh token -cookie kulkee.
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Rate limiting (before parsing, reject early)
app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
// Luku 12: refreshillä oma laskuri. Frontend kutsuu refreshiä jokaisella sivun
// latauksella; jos se jakaisi laskurin loginin kanssa, uloskirjautunut käyttäjä
// lukittuisi ulos loginista 5 sivunlatauksen jälkeen.
app.use("/api/auth/refresh", refreshLimiter);

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
