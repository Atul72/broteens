export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: "superadmin" | "admin" | "user" | "moderator";
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface SignupValues extends LoginValues {
  confirmPassword: string;
  fullName: string;
}
