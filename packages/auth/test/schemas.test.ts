import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../src/schemas.js";

describe("auth request schemas", () => {
  it("normalizes email addresses on sign up", () => {
    const result = signUpSchema.parse({
      email: "Person@Example.COM",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
      fullName: "Ada Lovelace",
    });

    expect(result.email).toBe("person@example.com");
  });

  it("rejects a mismatched confirmation password", () => {
    const result = signUpSchema.safeParse({
      email: "person@example.com",
      password: "StrongPass1",
      confirmPassword: "DifferentPass1",
      fullName: "Ada Lovelace",
    });

    expect(result.success).toBe(false);
  });

  it("does not apply sign-up complexity rules during sign in", () => {
    expect(
      signInSchema.safeParse({
        email: "person@example.com",
        password: "legacy-password",
      }).success,
    ).toBe(true);
  });

  it("normalizes forgot-password emails", () => {
    expect(
      forgotPasswordSchema.parse({ email: "Person@Example.COM" }).email,
    ).toBe("person@example.com");
  });
});
