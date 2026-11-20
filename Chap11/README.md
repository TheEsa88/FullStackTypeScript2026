# Chap11 – Authentication and Authorization

Pohjana on oma `Chap10-oma`-projekti (User/Post/Profile/Category + `src/db.ts`), koska kirjan luku 11 jatkaa suoraan siitä.
**Huom:** GitHubin `Chap11/blog`-kansio on eri projekti (Profile/Work-blogi ilman JWT:tä), eikä se vastaa kirjan luvun 11 tekstiä.

## Mihin kirjan koodi kuuluu

| Kirjan kohta | Tiedosto |
|---|---|
| Password validation rules (Zod-skeemat) | `src/schemas/auth.ts` |
| `validate()`-middleware | `src/middleware/validate.ts` |
| Adding password and role / RefreshToken model | `prisma/schema.prisma` |
| Prisma global omit for password | `src/db.ts` |
| Seed-skripti (argon2 + ADMIN-käyttäjä) | `prisma/seed.ts` (+ `seed` kohdassa `prisma.config.ts`) |
| Token utility functions + `daysFromNow` | `src/utils/jwt.ts` |
| `AuthError` | `src/errors.ts` |
| The auth service (register, login, duplicate email, cleanup) | `src/services/authService.ts` |
| `setRefreshTokenCookie` / `clearRefreshTokenCookie` | `src/utils/cookies.ts` |
| Auth routes: register, login, refresh, logout, sessions | `src/routes/authRoutes.ts` |
| Extending the Express Request type | `src/types/express.d.ts` |
| `authenticate`-middleware | `src/middleware/authenticate.ts` |
| `authorize`-middleware | `src/middleware/authorize.ts` |
| Protecting ownership + taulukko 11.2 | `src/routes/postRoutes.ts` (`requirePostOwnerOrStaff`), `src/routes/userRoutes.ts` |
| Rate limiting (`apiLimiter`, `authLimiter`) | `src/middleware/rateLimiters.ts` |
| `prismaErrorHandler` / `generalErrorHandler` | `src/middleware/errorHandlers.ts` |
| The complete middleware stack (helmet, cookieParser…) | `src/app.ts` |
| `app.listen` + tokenien siivous ajastettuna | `src/server.ts` |
| Test helpers (`createTestUser`) | `src/__tests__/helpers.ts` |
| prismaMock (vitest-mock-extended) | `src/__tests__/mocks/prisma.ts` |
| Unit tests for the auth service | `src/__tests__/unit/authService.test.ts` |
| Integration tests for auth endpoints | `src/__tests__/integration/auth.test.ts` |

Muutokset Chap10:een verrattuna:
- `app.ts` vain rakentaa appin ja exporttaa sen; `server.ts` käynnistää sen (supertest-testejä varten). `npm run dev` ajaa `src/server.ts`:n.
- `POST /api/v1/users` poistettu → käyttäjät luodaan `POST /api/auth/register` -reitillä.
- `POST /api/v1/posts` ottaa `authorId`:n tokenista, ei bodysta.
- Lisätty `"type": "module"` package.jsoniin (kirja käyttää ESM:ää).

## Käyttöönotto

1. Käynnistä PostgreSQL (sama Docker-kontti kuin luvussa 10, portti 5434). `.env` osoittaa tietokantaan `chap11db` ja siinä on valmiina generoidut `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`.
2. Aja migraatiot (luo myös `add-auth`-migraation):
   ```bash
   npx prisma migrate dev --name add-auth
   ```
3. Seedaa (kaikkien salasana `password123`, `admin@example.com` on ADMIN):
   ```bash
   npm run db:seed
   ```
4. `npm run dev`

## Testit

```bash
npm run test:unit
```
Integraatiotestit tarvitsevat erillisen testikannan: kopioi `.env.test.example` → `.env.test`, sitten
```bash
npx dotenv -e .env.test -- npx prisma migrate deploy
npm run test:integration
```

## Kokeilu (curl)

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password123"}' http://localhost:8000/api/auth/login
curl -H "Authorization: Bearer <accessToken>" http://localhost:8000/api/v1/users
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:8000/api/auth/refresh
curl -i -b cookies.txt -X POST http://localhost:8000/api/auth/logout
```
Huom: cookie on `path=/api/auth` ja `sameSite=strict`, joten se lähetetään vain auth-reiteille.
