import { z } from "zod";

const email = z
  .email()
  .max(320)
  .transform((value) => value.trim().toLowerCase());

const password = z
  .string()
  .min(8)
  .max(72)
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const signUpSchema = z
  .strictObject({
    email,
    password,
    confirmPassword: z.string(),
    fullName: z.string().trim().min(2).max(200),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.strictObject({
  email,
  password: z.string().min(1).max(72),
});

export const googleAuthSchema = z.strictObject({
  idToken: z.string().min(1).max(10_000),
});

export const refreshSchema = z.strictObject({
  refreshToken: z.string().min(32).max(1_000),
});

export const forgotPasswordSchema = z.strictObject({ email });

export const resetPasswordSchema = z
  .strictObject({
    token: z.string().min(32).max(1_000),
    password,
    confirmPassword: z.string(),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
