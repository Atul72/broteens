"use client";

import { useCallback } from "react";

import { useAsyncAction, useDisclosure } from "@broteens/hooks";
import { Alert, Button, FormField, Input } from "@repo/ui";
import { useForm } from "react-hook-form";

import { login } from "./api";
import { ForgotPasswordForm } from "./forgot-password-form";
import { GoogleAuthButton } from "./google-auth-button";
import type { AuthSession, LoginValues } from "./types";
import { useAuthSession } from "./use-auth-session";

export interface LoginFormProps {
  apiBaseUrl: string;
  googleClientId?: string | undefined;
  onSuccess?: ((session: AuthSession) => void) | undefined;
  redirectTo?: string | undefined;
  signupHref?: string | undefined;
}

export function LoginForm({
  apiBaseUrl,
  googleClientId,
  onSuccess,
  redirectTo = "/",
  signupHref = "/signup",
}: LoginFormProps) {
  const forgotPassword = useDisclosure();
  const { setSession } = useAuthSession();
  const authenticate = useCallback(
    (values: LoginValues) => login(apiBaseUrl, values),
    [apiBaseUrl],
  );
  const { error, execute, isPending } = useAsyncAction(authenticate);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginValues>();

  if (forgotPassword.isOpen) {
    return (
      <ForgotPasswordForm
        apiBaseUrl={apiBaseUrl}
        onCancel={forgotPassword.close}
      />
    );
  }

  async function submit(values: LoginValues) {
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
          or continue with email
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={handleSubmit((values) => void submit(values))}
      >
        <FormField
          htmlFor="email"
          label="Email address"
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="username"
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
          htmlFor="password"
          label="Password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            hasError={Boolean(errors.password)}
            disabled={isPending}
            {...register("password", { required: "Password is required" })}
          />
        </FormField>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={forgotPassword.open}
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Forgot password?
          </button>
        </div>

        {error ? <Alert variant="error">{error.message}</Alert> : null}

        <Button
          className="w-full"
          type="submit"
          size="lg"
          isLoading={isPending}
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        New to Broteens?{" "}
        <a
          className="font-semibold text-slate-950 hover:text-amber-700"
          href={signupHref}
        >
          Create an account
        </a>
      </p>
    </div>
  );
}
