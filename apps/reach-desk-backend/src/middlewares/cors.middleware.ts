import cors from "cors";
import type { RequestHandler } from "express";
import { AppError } from "@broteens/errors";

export function createCorsMiddleware(
  allowedOrigins: Set<string>,
): RequestHandler {
  return cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin) {
        return callback(null, true);
      }
      const normalized = requestOrigin.trim().replace(/\/$/, "");
      const isAllowed = allowedOrigins.has(normalized);

      callback(
        isAllowed
          ? null
          : new AppError(
              403,
              "CORS_ORIGIN_DENIED",
              "Cross-origin request blocked by policy",
            ),
        isAllowed,
      );
    },
    credentials: true,
    allowedHeaders: ["authorization", "content-type", "x-request-id"],
  });
}
