import { closeDatabase } from "@broteens/database";
import { createApp } from "./app.js";
import { getConfig } from "./config/index.js";

const { port } = getConfig();

const server = createApp().listen(port, () => {
  console.info(`[reach-desk-backend] Listening on http://localhost:${port}`);
});

let isShuttingDown = false;
async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.info(`[reach-desk-backend] Received ${signal}; shutting down`);
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
