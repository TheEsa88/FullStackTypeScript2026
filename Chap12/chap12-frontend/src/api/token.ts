// src/api/token.ts
// Access token elää vain muistissa (moduulin muuttuja), EI localStoragessa.
let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}
