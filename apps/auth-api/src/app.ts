import { randomUUID } from "node:crypto";

import { createAuthRouter, type PasswordResetMessage } from "@broteens/auth";
import { sql } from "@broteens/database";
import { AppError, globalErrorHandler } from "@broteens/errors";
import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
} from "express";
import helmet from "helmet";

function environmentNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return parsed;
}

function allowedOrigins(): Set<string> {
  const configured =
    process.env.CORS_ORIGINS ??
    process.env.FRONTEND_URL ??
    "http://localhost:3000";
  return new Set(
    configured
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
}

function developmentPasswordResetSender() {
  return async ({ email, token, expiresAt }: PasswordResetMessage) => {
    if (process.env.NODE_ENV === "production") {
      throw new AppError(
        503,
        "EMAIL_DELIVERY_NOT_CONFIGURED",
        "Password reset email delivery is not configured",
      );
    }
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
    console.info("[auth] Development password reset", {
      email,
      expiresAt: expiresAt.toISOString(),
      resetUrl,
    });
  };
}

export function createApp(): Express {
  const app = express();
  const origins = allowedOrigins();

  app.disable("x-powered-by");
  app.set("trust proxy", environmentNumber("TRUST_PROXY", 0));
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    }),
  );
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin || origins.has(origin.replace(/\/$/, ""))) {
          callback(null, true);
          return;
        }
        callback(
          new AppError(
            403,
            "ORIGIN_NOT_ALLOWED",
            "Request origin is not allowed",
          ),
        );
      },
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(((request, response, next) => {
    const requestId = request.get("x-request-id") ?? randomUUID();
    response.locals.requestId = requestId;
    response.setHeader("x-request-id", requestId);
    next();
  }) satisfies RequestHandler);

  app.get("/health/live", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });
  app.get("/health/ready", async (_request, response) => {
    await sql`select 1`;
    response.status(200).json({ status: "ready" });
  });

  app.use(
    "/v1/auth",
    createAuthRouter({ sendPasswordReset: developmentPasswordResetSender() }),
  );

  app.use((_request, _response, next) => {
    next(new AppError(404, "ROUTE_NOT_FOUND", "API route was not found"));
  });

  const errorHandler: ErrorRequestHandler = (
    error,
    request,
    response,
    next,
  ) => {
    if (!(error instanceof AppError) || error.statusCode >= 500) {
      console.error("[api] Request failed", {
        error,
        method: request.method,
        path: request.path,
        requestId: response.locals.requestId,
      });
    }
    void globalErrorHandler(error, request, response, next);
  };
  app.use(errorHandler);

  return app;
}
