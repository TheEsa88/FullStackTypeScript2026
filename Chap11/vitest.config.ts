import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Integraatiotestit jakavat saman tietokannan -> ei rinnakkain
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "test-access-secret-at-least-32-characters",
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-at-least-32-characters",
    },
  },
});
