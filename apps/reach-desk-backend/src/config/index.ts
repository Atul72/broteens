export interface AppConfig {
  port: number;
  corsOrigins: Set<string>;
  nodeEnv: string;
}

function parseOrigins(rawConfigured?: string): Set<string> {
  const configured =
    rawConfigured ??
    process.env.FRONTEND_URL ??
    "http://localhost:3000,http://localhost:3001,http://localhost:3002";

  return new Set(
    configured
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
}

export function getConfig(): AppConfig {
  const rawPort = process.env.PORT ?? "5000";
  const port = Number(rawPort);

  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error(
      `PORT must be an integer between 1 and 65535, received: ${rawPort}`,
    );
  }

  return {
    port,
    corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}
