import { createHash, randomBytes, randomUUID } from "node:crypto";

import {
  authAccounts,
  authTokens,
  db,
  users,
  type User,
} from "@broteens/database";
import { AppError } from "@broteens/errors";
import { compare, hash } from "bcryptjs";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import jwt, { type JwtPayload } from "jsonwebtoken";

import type { AuthConfig } from "./config.js";
import type {
  AuthContext,
  AuthResult,
  PublicUser,
  RequestMetadata,
  TokenPair,
} from "./types.js";
import type {
  ForgotPasswordInput,
  GoogleAuthInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "./schemas.js";

const INVALID_CREDENTIALS = new AppError(
  401,
  "INVALID_CREDENTIALS",
  "Email or password is incorrect",
);

const DUMMY_PASSWORD_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.1uG9zL7W8WnR2XzQ5vVJQZJ7DnK6H6G";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Executor = typeof db | Transaction;
type TokenInsert = typeof authTokens.$inferInsert;

export interface PasswordResetMessage {
  email: string;
  fullName: string;
  token: string;
  expiresAt: Date;
}

export interface AuthServiceOptions {
  config: AuthConfig;
  sendPasswordReset: (message: PasswordResetMessage) => Promise<void>;
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1_000);
}

function publicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: user.emailVerifiedAt !== null,
    createdAt: user.createdAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(private readonly options: AuthServiceOptions) {
    this.googleClient = new OAuth2Client(options.config.googleClientId);
  }

  private createTokenPair(
    userId: string,
    metadata: RequestMetadata,
    sessionId: string = randomUUID(),
  ): { response: TokenPair; records: [TokenInsert, TokenInsert] } {
    const now = new Date();
    const accessJti = randomUUID();
    const accessTokenExpiresAt = addSeconds(
      now,
      this.options.config.accessTokenTtlSeconds,
    );
    const refreshTokenExpiresAt = addSeconds(
      now,
      this.options.config.refreshTokenTtlSeconds,
    );
    const accessToken = jwt.sign(
      { sid: sessionId, type: "access" },
      this.options.config.jwtSecret,
      {
        algorithm: "HS256",
        audience: this.options.config.jwtAudience,
        expiresIn: this.options.config.accessTokenTtlSeconds,
        issuer: this.options.config.jwtIssuer,
        jwtid: accessJti,
        subject: userId,
      },
    );
    const refreshToken = randomBytes(48).toString("base64url");

    const common = {
      userId,
      sessionId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    };
    return {
      response: {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      },
      records: [
        {
          ...common,
          type: "access",
          tokenHash: tokenHash(accessToken),
          expiresAt: accessTokenExpiresAt,
        },
        {
          ...common,
          type: "refresh",
          tokenHash: tokenHash(refreshToken),
          expiresAt: refreshTokenExpiresAt,
        },
      ],
    };
  }

  private async storePair(
    executor: Executor,
    userId: string,
    metadata: RequestMetadata,
    sessionId?: string,
  ): Promise<TokenPair> {
    const pair = this.createTokenPair(userId, metadata, sessionId);
    await executor.insert(authTokens).values(pair.records);
    return pair.response;
  }

  async signUp(
    input: SignUpInput,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const passwordHash = await hash(
      input.password,
      this.options.config.bcryptCost,
    );
    try {
      return await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(users)
          .values({
            email: input.email,
            fullName: input.fullName,
            passwordHash,
          })
          .returning();
        if (!user)
          throw new AppError(
            500,
            "USER_CREATE_FAILED",
            "Could not create user",
          );

        await tx.insert(authAccounts).values({
          userId: user.id,
          provider: "password",
          providerAccountId: user.id,
          providerEmail: user.email,
        });
        const tokens = await this.storePair(tx, user.id, metadata);
        return { user: publicUser(user), ...tokens };
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "An account already exists for this email",
        );
      }
      throw error;
    }
  }

  async signIn(
    input: SignInInput,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);
    const matches = await compare(
      input.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );
    if (!user || !user.passwordHash || !matches) throw INVALID_CREDENTIALS;
    this.assertActive(user);
    const tokens = await this.storePair(db, user.id, metadata);
    return { user: publicUser(user), ...tokens };
  }

  async googleAuth(
    input: GoogleAuthInput,
    metadata: RequestMetadata,
  ): Promise<AuthResult> {
    const clientId = this.options.config.googleClientId;
    if (!clientId) {
      throw new AppError(
        503,
        "GOOGLE_AUTH_NOT_CONFIGURED",
        "Google authentication is not configured",
      );
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: input.idToken,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (cause) {
      throw new AppError(
        401,
        "INVALID_GOOGLE_TOKEN",
        "Google token is invalid",
        { cause },
      );
    }
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new AppError(
        401,
        "INVALID_GOOGLE_TOKEN",
        "Google account must have a verified email",
      );
    }

    const email = payload.email.trim().toLowerCase();
    const user = await db.transaction(async (tx) => {
      const [linked] = await tx
        .select({ user: users })
        .from(authAccounts)
        .innerJoin(users, eq(authAccounts.userId, users.id))
        .where(
          and(
            eq(authAccounts.provider, "google"),
            eq(authAccounts.providerAccountId, payload.sub),
          ),
        )
        .limit(1);
      if (linked) return linked.user;

      let [existing] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!existing) {
        [existing] = await tx
          .insert(users)
          .values({
            email,
            fullName: payload.name?.trim() || email.split("@")[0] || "User",
            avatarUrl: payload.picture,
            emailVerifiedAt: new Date(),
          })
          .onConflictDoNothing({ target: users.email })
          .returning();
        if (!existing) {
          [existing] = await tx
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        }
      } else if (!existing.emailVerifiedAt) {
        [existing] = await tx
          .update(users)
          .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
          .where(eq(users.id, existing.id))
          .returning();
      }
      if (!existing) {
        throw new AppError(500, "USER_CREATE_FAILED", "Could not create user");
      }

      await tx
        .insert(authAccounts)
        .values({
          userId: existing.id,
          provider: "google",
          providerAccountId: payload.sub,
          providerEmail: email,
        })
        .onConflictDoNothing();

      const [resolved] = await tx
        .select({ user: users })
        .from(authAccounts)
        .innerJoin(users, eq(authAccounts.userId, users.id))
        .where(
          and(
            eq(authAccounts.provider, "google"),
            eq(authAccounts.providerAccountId, payload.sub),
          ),
        )
        .limit(1);
      if (!resolved) {
        throw new AppError(
          500,
          "ACCOUNT_LINK_FAILED",
          "Could not link Google account",
        );
      }
      return resolved.user;
    });

    this.assertActive(user);
    const tokens = await this.storePair(db, user.id, metadata);
    return { user: publicUser(user), ...tokens };
  }

  async refresh(
    refreshToken: string,
    metadata: RequestMetadata,
  ): Promise<TokenPair> {
    const now = new Date();
    const result = await db.transaction(async (tx) => {
      const [row] = await tx
        .select({ token: authTokens, user: users })
        .from(authTokens)
        .innerJoin(users, eq(authTokens.userId, users.id))
        .where(
          and(
            eq(authTokens.tokenHash, tokenHash(refreshToken)),
            eq(authTokens.type, "refresh"),
          ),
        )
        .limit(1)
        .for("update");

      if (!row || row.token.expiresAt <= now)
        return { kind: "invalid" } as const;
      if (row.token.revokedAt) {
        await tx
          .update(authTokens)
          .set({ revokedAt: now })
          .where(
            and(
              eq(authTokens.sessionId, row.token.sessionId),
              isNull(authTokens.revokedAt),
            ),
          );
        return { kind: "reused" } as const;
      }
      this.assertActive(row.user);
      await tx
        .update(authTokens)
        .set({ revokedAt: now, lastUsedAt: now })
        .where(eq(authTokens.id, row.token.id));
      const pair = await this.storePair(
        tx,
        row.user.id,
        metadata,
        row.token.sessionId,
      );
      return { kind: "ok", pair } as const;
    });

    if (result.kind === "reused") {
      throw new AppError(
        401,
        "REFRESH_TOKEN_REUSED",
        "This session has been revoked",
      );
    }
    if (result.kind === "invalid") {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Refresh token is invalid or expired",
      );
    }
    return result.pair;
  }

  async logout(refreshToken: string): Promise<void> {
    const [token] = await db
      .select({ sessionId: authTokens.sessionId })
      .from(authTokens)
      .where(
        and(
          eq(authTokens.tokenHash, tokenHash(refreshToken)),
          eq(authTokens.type, "refresh"),
        ),
      )
      .limit(1);
    if (!token) return;
    await db
      .update(authTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(authTokens.sessionId, token.sessionId),
          isNull(authTokens.revokedAt),
        ),
      );
  }

  async logoutAll(userId: string): Promise<void> {
    await db
      .update(authTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(authTokens.userId, userId), isNull(authTokens.revokedAt)));
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);
    if (!user || user.status !== "active") return;

    const rawToken = randomBytes(48).toString("base64url");
    const expiresAt = addSeconds(
      new Date(),
      this.options.config.passwordResetTtlSeconds,
    );
    await db.transaction(async (tx) => {
      await tx
        .update(authTokens)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(authTokens.userId, user.id),
            eq(authTokens.type, "password_reset"),
            isNull(authTokens.revokedAt),
          ),
        );
      await tx.insert(authTokens).values({
        userId: user.id,
        type: "password_reset",
        tokenHash: tokenHash(rawToken),
        sessionId: randomUUID(),
        expiresAt,
      });
    });

    await this.options.sendPasswordReset({
      email: user.email,
      fullName: user.fullName,
      token: rawToken,
      expiresAt,
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const passwordHash = await hash(
      input.password,
      this.options.config.bcryptCost,
    );
    const now = new Date();
    const succeeded = await db.transaction(async (tx) => {
      const [resetToken] = await tx
        .select()
        .from(authTokens)
        .where(
          and(
            eq(authTokens.tokenHash, tokenHash(input.token)),
            eq(authTokens.type, "password_reset"),
            isNull(authTokens.revokedAt),
            gt(authTokens.expiresAt, now),
          ),
        )
        .limit(1)
        .for("update");
      if (!resetToken) return false;

      await tx
        .update(users)
        .set({ passwordHash, updatedAt: now })
        .where(eq(users.id, resetToken.userId));
      await tx
        .insert(authAccounts)
        .values({
          userId: resetToken.userId,
          provider: "password",
          providerAccountId: resetToken.userId,
        })
        .onConflictDoNothing();
      await tx
        .update(authTokens)
        .set({ revokedAt: now })
        .where(
          and(
            eq(authTokens.userId, resetToken.userId),
            isNull(authTokens.revokedAt),
          ),
        );
      return true;
    });

    if (!succeeded) {
      throw new AppError(
        400,
        "INVALID_RESET_TOKEN",
        "Reset token is invalid or expired",
      );
    }
  }

  async authenticateAccessToken(accessToken: string): Promise<AuthContext> {
    let payload: JwtPayload;
    try {
      const verified = jwt.verify(accessToken, this.options.config.jwtSecret, {
        algorithms: ["HS256"],
        audience: this.options.config.jwtAudience,
        issuer: this.options.config.jwtIssuer,
      });
      if (typeof verified === "string")
        throw new Error("Unexpected JWT payload");
      payload = verified;
    } catch (cause) {
      throw new AppError(
        401,
        "INVALID_ACCESS_TOKEN",
        "Access token is invalid or expired",
        {
          cause,
        },
      );
    }

    if (
      !payload.sub ||
      typeof payload.sid !== "string" ||
      payload.type !== "access"
    ) {
      throw new AppError(
        401,
        "INVALID_ACCESS_TOKEN",
        "Access token is invalid or expired",
      );
    }

    const [row] = await db
      .select({ token: authTokens, user: users })
      .from(authTokens)
      .innerJoin(users, eq(authTokens.userId, users.id))
      .where(
        and(
          eq(authTokens.tokenHash, tokenHash(accessToken)),
          eq(authTokens.type, "access"),
          isNull(authTokens.revokedAt),
          gt(authTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (
      !row ||
      row.user.id !== payload.sub ||
      row.token.sessionId !== payload.sid
    ) {
      throw new AppError(
        401,
        "INVALID_ACCESS_TOKEN",
        "Access token is invalid or expired",
      );
    }
    this.assertActive(row.user);
    return {
      userId: row.user.id,
      sessionId: row.token.sessionId,
      user: publicUser(row.user),
    };
  }

  /**
   * Run from a scheduled job after the desired audit-retention window.
   * The expires_at index keeps this maintenance query efficient.
   */
  async deleteExpiredTokens(before: Date = new Date()): Promise<void> {
    await db.delete(authTokens).where(lt(authTokens.expiresAt, before));
  }
  private assertActive(user: User): void {
    if (user.status !== "active") {
      throw new AppError(
        403,
        "ACCOUNT_UNAVAILABLE",
        "This account is not active",
      );
    }
  }
}
