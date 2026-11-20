import app from "./app.js";
import { prisma } from "./db.js";
import { cleanupExpiredTokens } from "./services/authService.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// "Cleaning up expired tokens": siivotaan vanhentuneet refresh tokenit kerran tunnissa
setInterval(
  async () => {
    const count = await cleanupExpiredTokens();
    if (count > 0) console.log(`Removed ${count} expired refresh tokens`);
  },
  60 * 60 * 1000,
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
