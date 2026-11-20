// Sama vitest-mock-extended -kaava kuin luvussa 10
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import { beforeEach } from "vitest";
import type { prisma } from "../../db.js";

export const prismaMock = mockDeep<typeof prisma>() as unknown as DeepMockProxy<
  typeof prisma
>;

beforeEach(() => {
  mockReset(prismaMock);
});
