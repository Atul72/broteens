import { AppError } from "@broteens/errors";

export interface AuthConfig {
  jwtSecret: string;
  jwtIssuer: string;
  jwtAudience: string;
  googleClientId: string | undefined;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  passwordResetTtlSeconds: number;
  bcryptCost: number;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new AppError(
      500,
      "AUTH_CONFIG_INVALID",
      "Auth TTL configuration is invalid",
    );
  }
  return parsed;
}

export function loadAuthConfig(
  overrides: Partial<AuthConfig> = {},
): AuthConfig {
  const jwtSecret = overrides.jwtSecret ?? process.env.AUTH_JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new AppError(
      500,
      "AUTH_CONFIG_INVALID",
      "AUTH_JWT_SECRET must contain at least 32 characters",
    );
  }

  return {
    jwtSecret,
    jwtIssuer:
      overrides.jwtIssuer ?? process.env.AUTH_JWT_ISSUER ?? "broteens-api",
    jwtAudience:
      overrides.jwtAudience ??
      process.env.AUTH_JWT_AUDIENCE ??
      "broteens-client",
    googleClientId: overrides.googleClientId ?? process.env.GOOGLE_CLIENT_ID,
    accessTokenTtlSeconds:
      overrides.accessTokenTtlSeconds ??
      positiveInteger(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS, 15 * 60),
    refreshTokenTtlSeconds:
      overrides.refreshTokenTtlSeconds ??
      positiveInteger(
        process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
        30 * 24 * 60 * 60,
      ),
    passwordResetTtlSeconds:
      overrides.passwordResetTtlSeconds ??
      positiveInteger(process.env.AUTH_PASSWORD_RESET_TTL_SECONDS, 60 * 60),
    bcryptCost:
      overrides.bcryptCost ?? positiveInteger(process.env.AUTH_BCRYPT_COST, 12),
  };
}
