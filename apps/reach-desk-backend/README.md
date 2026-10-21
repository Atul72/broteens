# Reachdesk Backend

Express API backend for Reachdesk workspace and templates services.

```bash
docker compose up -d
pnpm --filter @broteens/reach-desk-backend dev
```

The server listens on `http://localhost:5000`.

- Health checks: `/health/live`, `/health/ready`
- Modules & Privileges: `/v1/modules`, `/v1/users/:userId/privileges`
- Card Templates: `/api/cardTemplate/*`, `/v1/templates/*`
