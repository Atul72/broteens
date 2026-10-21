import express, { type Express } from "express";
import helmet from "helmet";
import { AppError } from "@broteens/errors";

import { getConfig } from "./config/index.js";
import { createCorsMiddleware } from "./middlewares/cors.middleware.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const config = getConfig();
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", true);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // Cross-Origin Resource Sharing
  app.use(createCorsMiddleware(config.corsOrigins));

  // Body parser
  app.use(express.json({ limit: "1mb" }));

  // Tracing / Request-ID
  app.use(requestIdMiddleware);

  // Application Routes
  app.use(apiRouter);

  // 404 Not Found fallback
  app.use((_request, _response, next) => {
    next(new AppError(404, "ROUTE_NOT_FOUND", "API route was not found"));
  });

  // Global Error Handler
  app.use(errorHandlerMiddleware);

  return app;
}
