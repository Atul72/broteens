export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: "superadmin" | "admin" | "user" | "moderator";
  userType: "internal" | "external";
  emailVerified: boolean;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthSession extends TokenPair {
  user: AuthUser;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface SignupValues extends LoginValues {
  confirmPassword: string;
  fullName: string;
  userType?: "internal" | "external";
}
