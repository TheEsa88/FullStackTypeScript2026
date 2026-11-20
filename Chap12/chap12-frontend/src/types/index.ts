// Luku 12: jaetut TypeScript-rajapinnat. Vastaavat backendin Prisma-malleja (luku 10/11).
// Huom: backendissä id:t ovat Int -> number (kirjan esimerkeissä string).

export type Role = 'USER' | 'ADMIN' | 'MODERATOR'

export interface User {
  id: number
  email: string
  username: string
  role: Role
  createdAt?: string
  updatedAt?: string
}

export interface Post {
  id: number
  title: string
  summary?: string | null
  content: string | null
  published: boolean
  views: number
  authorId: number
  author?: { id: number; username: string }
  createdAt: string
  updatedAt: string
}

// POST /api/auth/login ja /api/auth/register palauttavat tämän
export interface LoginResponse {
  user: User
  accessToken: string
}

// GET /api/v1/posts palauttaa sivutetun listan
export interface PostList {
  data: Post[]
  meta: { total: number; page: number; totalPages: number }
}
