"use client";

import { useCallback } from "react";

import { useAsyncAction } from "@broteens/hooks";
import { Alert, Button, FormField, Input } from "@repo/ui";
import { useForm } from "react-hook-form";

import { resetPassword } from "./api";

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm({
  apiBaseUrl,
  loginHref = "/login",
  token,
}: {
  apiBaseUrl: string;
  loginHref?: string;
  token: string;
}) {
  const reset = useCallback(
    (values: ResetPasswordValues) =>
      resetPassword(apiBaseUrl, { token, ...values }),
    [apiBaseUrl, token],
  );
  const { data, error, execute, isPending } = useAsyncAction(reset);
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<ResetPasswordValues>();

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(
        (values) => void execute(values).catch(() => undefined),
      )}
    >
      <FormField
        htmlFor="new-password"
        label="New password"
        error={errors.password?.message}
      >
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.password)}
          disabled={isPending}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Use at least 8 characters" },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Include an uppercase, lowercase and number",
            },
          })}
        />
      </FormField>
      <FormField
        htmlFor="new-password-confirm"
        label="Confirm password"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="new-password-confirm"
          type="password"
          autoComplete="new-password"
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
      {data !== null ? (
        <Alert variant="success">
          Password updated.{" "}
          <a className="font-semibold underline" href={loginHref}>
            Sign in
          </a>
        </Alert>
      ) : null}
      <Button className="w-full" type="submit" size="lg" isLoading={isPending}>
        Update password
      </Button>
    </form>
  );
}
