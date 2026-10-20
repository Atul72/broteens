import type { User } from "@broteens/database";

export interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: User["role"];
  userType: User["userType"];
  emailVerified: boolean;
  createdAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface AuthResult extends TokenPair {
  user: PublicUser;
}

export interface AuthContext {
  userId: string;
  sessionId: string;
  user: PublicUser;
}
