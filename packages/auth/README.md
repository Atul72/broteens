# @broteens/auth

Express auth routes backed by the shared PostgreSQL/Drizzle database.

## Mounting

```ts
import express from "express";
import { createAuthRouter, globalErrorHandler } from "@broteens/auth";

const app = express();
app.use(express.json({ limit: "32kb" }));
app.use(
  "/v1/auth",
  createAuthRouter({
    sendPasswordReset: async ({ email, token }) => {
      // Send a link containing token with your email provider.
    },
  }),
);
app.use(globalErrorHandler);
```

Required environment:

- `AUTH_JWT_SECRET`: random secret with at least 32 characters.
- `GOOGLE_CLIENT_ID`: Google OAuth web client ID (required only for Google auth).

Optional environment:

- `AUTH_JWT_ISSUER` (default `broteens-api`)
- `AUTH_JWT_AUDIENCE` (default `broteens-client`)
- `AUTH_ACCESS_TOKEN_TTL_SECONDS` (default 900)
- `AUTH_REFRESH_TOKEN_TTL_SECONDS` (default 2592000)
- `AUTH_PASSWORD_RESET_TTL_SECONDS` (default 3600)
- `AUTH_BCRYPT_COST` (default 12)

## Routes

All routes are relative to the mount path:

- `POST /signup`
- `POST /signin`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `POST /logout-all` (Bearer access token required)
- `POST /forgot-password`
- `POST /reset-password`
- `GET /me` (Bearer access token required)
- `PATCH /profile` (Bearer access token required)

Run `pnpm --filter @broteens/database db:generate` and apply the generated migration before serving requests.

For bounded token-table growth, call `AuthService.deleteExpiredTokens()` from a
scheduled worker after your required audit-retention window.
