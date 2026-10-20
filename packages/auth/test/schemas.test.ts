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

  it("defaults userType to external on signup when omitted", () => {
    const result = signUpSchema.parse({
      email: "person@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
      fullName: "Ada Lovelace",
    });

    expect(result.userType).toBe("external");
  });

  it("accepts valid userType values (internal and external)", () => {
    const internal = signUpSchema.parse({
      email: "internal@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
      fullName: "Internal User",
      userType: "internal",
    });
    expect(internal.userType).toBe("internal");

    const external = signUpSchema.parse({
      email: "external@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
      fullName: "External User",
      userType: "external",
    });
    expect(external.userType).toBe("external");
  });

  it("rejects invalid userType", () => {
    const result = signUpSchema.safeParse({
      email: "invalid@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
      fullName: "Invalid User",
      userType: "guest",
    });

    expect(result.success).toBe(false);
  });
});
