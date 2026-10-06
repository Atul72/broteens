import { AppError } from "@broteens/errors";
import { Router, type Request, type RequestHandler } from "express";
import { ZodError, type ZodType } from "zod";

import { loadAuthConfig, type AuthConfig } from "./config.js";
import {
  forgotPasswordSchema,
  googleAuthSchema,
  refreshSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "./schemas.js";
import {
  AuthService,
  type AuthServiceOptions,
  type PasswordResetMessage,
} from "./service.js";
import type { AuthContext, RequestMetadata } from "./types.js";

// Options for creating the authentication router
export interface CreateAuthRouterOptions {
  config?: Partial<AuthConfig>;
  sendPasswordReset: (message: PasswordResetMessage) => Promise<void>;
}

// Request body validation helper
function body<T>(schema: ZodType<T>, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(400, "VALIDATION_ERROR", "Request validation failed", {
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    throw error;
  }
}

// Extract request metadata (IP address and user agent)
function metadata(request: Request): RequestMetadata {
  const userAgent = request.get("user-agent");
  return {
    ...(request.ip ? { ipAddress: request.ip } : {}),
    ...(userAgent ? { userAgent } : {}),
  };
}

export function createRequireAuth(service: AuthService): RequestHandler {
  return async (request, response, next) => {
    try {
      const authorization = request.get("authorization");
      const [scheme, token, ...extra] = authorization?.split(" ") ?? [];
      if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
        throw new AppError(
          401,
          "AUTHENTICATION_REQUIRED",
          "A Bearer access token is required",
        );
      }
      response.locals.auth = await service.authenticateAccessToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function getAuthContext(locals: Record<string, unknown>): AuthContext {
  const auth = locals.auth;
  if (!auth || typeof auth !== "object" || !("userId" in auth)) {
    throw new AppError(
      500,
      "AUTH_CONTEXT_MISSING",
      "Authentication middleware is not installed",
    );
  }
  return auth as AuthContext;
}

export function createAuthRouter(options: CreateAuthRouterOptions): Router {
  const serviceOptions: AuthServiceOptions = {
    config: loadAuthConfig(options.config),
    sendPasswordReset: options.sendPasswordReset,
  };
  const service = new AuthService(serviceOptions);
  const requireAuth = createRequireAuth(service);
  const router = Router();

  router.post("/signup", async (request, response) => {
    const result = await service.signUp(
      body(signUpSchema, request.body),
      metadata(request),
    );
    response.status(201).json(result);
  });

  router.post("/signin", async (request, response) => {
    const result = await service.signIn(
      body(signInSchema, request.body),
      metadata(request),
    );
    response.status(200).json(result);
  });

  router.post("/google", async (request, response) => {
    const result = await service.googleAuth(
      body(googleAuthSchema, request.body),
      metadata(request),
    );
    response.status(200).json(result);
  });

  router.post("/refresh", async (request, response) => {
    const input = body(refreshSchema, request.body);
    const result = await service.refresh(input.refreshToken, metadata(request));
    response.status(200).json(result);
  });

  router.post("/logout", async (request, response) => {
    const input = body(refreshSchema, request.body);
    await service.logout(input.refreshToken);
    response.status(204).send();
  });

  router.post("/logout-all", requireAuth, async (_request, response) => {
    await service.logoutAll(getAuthContext(response.locals).userId);
    response.status(204).send();
  });

  router.post("/forgot-password", async (request, response) => {
    await service.forgotPassword(body(forgotPasswordSchema, request.body));
    response.status(202).json({
      message:
        "If that email is registered, password reset instructions will be sent",
    });
  });

  router.post("/reset-password", async (request, response) => {
    await service.resetPassword(body(resetPasswordSchema, request.body));
    response.status(204).send();
  });

  router.get("/me", requireAuth, (_request, response) => {
    response.status(200).json({ user: getAuthContext(response.locals).user });
  });

  router.patch("/profile", requireAuth, async (request, response) => {
    const user = await service.updateProfile(
      getAuthContext(response.locals).userId,
      body(updateProfileSchema, request.body),
    );
    response.status(200).json({ user });
  });

  return router;
}
