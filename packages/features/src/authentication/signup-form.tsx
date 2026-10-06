"use client";

import { useCallback } from "react";

import { useAsyncAction } from "@broteens/hooks";
import { Alert, Button, FormField, Input } from "@repo/ui";
import { useForm } from "react-hook-form";

import { signup } from "./api";
import { GoogleAuthButton } from "./google-auth-button";
import type { AuthSession, SignupValues } from "./types";
import { useAuthSession } from "./use-auth-session";

export interface SignupFormProps {
  apiBaseUrl: string;
  googleClientId?: string | undefined;
  loginHref?: string | undefined;
  onSuccess?: ((session: AuthSession) => void) | undefined;
  redirectTo?: string | undefined;
}

export function SignupForm({
  apiBaseUrl,
  googleClientId,
  loginHref = "/login",
  onSuccess,
  redirectTo = "/",
}: SignupFormProps) {
  const { setSession } = useAuthSession();
  const createAccount = useCallback(
    (values: SignupValues) => signup(apiBaseUrl, values),
    [apiBaseUrl],
  );
  const { error, execute, isPending } = useAsyncAction(createAccount);
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<SignupValues>();

  async function submit(values: SignupValues) {
    try {
      const session = await execute(values);
      setSession(session);
      if (onSuccess) onSuccess(session);
      else window.location.assign(redirectTo);
    } catch {
      // The hook exposes the normalized error below.
    }
  }

  return (
    <div className="space-y-6">
      <GoogleAuthButton
        apiBaseUrl={apiBaseUrl}
        clientId={googleClientId}
        onSuccess={onSuccess}
        redirectTo={redirectTo}
      />
      {googleClientId ? (
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or create one with email
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => void submit(values))}
      >
        <FormField
          htmlFor="fullName"
          label="Full name"
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Your full name"
            hasError={Boolean(errors.fullName)}
            disabled={isPending}
            {...register("fullName", {
              required: "Full name is required",
              minLength: { value: 2, message: "Use at least 2 characters" },
            })}
          />
        </FormField>

        <FormField
          htmlFor="signup-email"
          label="Email address"
          error={errors.email?.message}
        >
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            hasError={Boolean(errors.email)}
            disabled={isPending}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            })}
          />
        </FormField>

        <FormField
          htmlFor="signup-password"
          label="Password"
          hint="At least 8 characters with upper, lower and a number"
          error={errors.password?.message}
        >
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            hasError={Boolean(errors.password)}
            disabled={isPending}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
              maxLength: {
                value: 72,
                message: "Use no more than 72 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Include an uppercase, lowercase and number",
              },
            })}
          />
        </FormField>

        <FormField
          htmlFor="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            hasError={Boolean(errors.confirmPassword)}
            disabled={isPending}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
          />
        </FormField>

        {error ? <Alert variant="error">{error.message}</Alert> : null}

        <Button
          className="mt-1 w-full"
          type="submit"
          size="lg"
          isLoading={isPending}
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a
          className="font-semibold text-slate-950 hover:text-amber-700"
          href={loginHref}
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
