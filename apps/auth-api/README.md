# Broteens Auth API

Express API host for the workspace backend packages.

```bash
docker compose up -d
pnpm --filter @broteens/database db:push
pnpm --filter @broteens/auth-api dev
```

The server listens on `http://localhost:4000`. Auth routes are mounted at
`/v1/auth`; liveness and database readiness are available at `/health/live` and
`/health/ready`.

In development, forgot-password links are printed to the API terminal. Production
must replace the development sender in `src/app.ts` with an email provider.
