// Luku 11: "Update the seed script to hash passwords with argon2.hash('password123')
// before inserting users and assign role: 'ADMIN' to at least one test user"
import "dotenv/config";
import * as argon2 from "argon2";
import { prisma } from "../src/db.js";

async function main() {
  const password = await argon2.hash("password123", { type: argon2.argon2id });

  const users = [
    { email: "admin@example.com", username: "admin", role: "ADMIN" as const },
    { email: "mod@example.com", username: "moderator", role: "MODERATOR" as const },
    { email: "jon@example.com", username: "jon", role: "USER" as const },
    { email: "dave@example.com", username: "dave", role: "USER" as const },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password, role: u.role },
      create: { ...u, password },
    });
  }

  const jon = await prisma.user.findUniqueOrThrow({ where: { email: "jon@example.com" } });
  const postCount = await prisma.post.count({ where: { authorId: jon.id } });
  if (postCount === 0) {
    await prisma.post.createMany({
      data: [
        { title: "First Post", content: "Hello world", published: true, authorId: jon.id },
        { title: "Draft Post", content: "Work in progress", authorId: jon.id },
      ],
    });
  }

  console.log("Seed valmis. Kaikkien käyttäjien salasana: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
