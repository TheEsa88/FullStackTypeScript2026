import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

// --- Kuka tahansa kirjautunut käyttäjä: /users/me ---
// HUOM: /me pitää määritellä ENNEN /:id-reittiä, muuten "me" tulkittaisiin id:ksi.
router.get("/api/v1/users/me", authenticate, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { profile: true, _count: { select: { posts: true } } },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
});

router.put("/api/v1/users/me", authenticate, async (req: Request, res: Response) => {
  // Käyttäjä EI voi muuttaa omaa rooliaan -> vain username
  const { username } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { username },
  });
  res.status(200).json(user);
});

// --- Vain ADMIN ---
// GET all users (with profile and post count)
router.get(
  "/api/v1/users",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        _count: { select: { posts: true } },
      },
    });
    res.status(200).json(users);
  },
);

// GET single user by id (full detail) - kirjautuneille
router.get("/api/v1/users/:id", authenticate, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      profile: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: { categories: true },
      },
    },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json(user);
});

// Luku 10:n "POST /api/v1/users" on poistettu: käyttäjät luodaan nyt
// POST /api/auth/register -reitillä (salasana pakollinen).

// PUT update user (myös roolin vaihto) - vain ADMIN
router.put(
  "/api/v1/users/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response) => {
    const { username, email, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { username, email, role },
    });
    res.status(200).json(user);
  },
);

// PUT create or update user profile - oma profiili tai ADMIN
router.put(
  "/api/v1/users/:id/profile",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (userId !== req.user!.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    const { bio, avatar } = req.body;
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { bio, avatar },
      create: { bio, avatar, userId },
    });
    res.status(200).json(profile);
  },
);

// DELETE user (cascades to profile, posts and refresh tokens) - vain ADMIN
router.delete(
  "/api/v1/users/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response) => {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  },
);

export default router;
