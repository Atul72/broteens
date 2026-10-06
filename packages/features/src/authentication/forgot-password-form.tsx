"use client";

import { useCallback } from "react";

import { useAsyncAction } from "@broteens/hooks";
import { Alert, Button, FormField, Input } from "@repo/ui";
import { useForm } from "react-hook-form";

import { forgotPassword } from "./api";

interface ForgotPasswordValues {
  email: string;
}

export function ForgotPasswordForm({
  apiBaseUrl,
  onCancel,
}: {
  apiBaseUrl: string;
  onCancel?: () => void;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordValues>();
  const sendReset = useCallback(
    ({ email }: ForgotPasswordValues) => forgotPassword(apiBaseUrl, email),
    [apiBaseUrl],
  );
  const { data, error, execute, isPending } = useAsyncAction(sendReset);

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(
        (values) => void execute(values).catch(() => undefined),
      )}
    >
      <FormField
        htmlFor="forgot-email"
        label="Email address"
        error={errors.email?.message}
      >
        <Input
          id="forgot-email"
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
      {error ? <Alert variant="error">{error.message}</Alert> : null}
      {data ? <Alert variant="success">{data.message}</Alert> : null}
      <Button className="w-full" type="submit" isLoading={isPending} size="lg">
        Send reset instructions
      </Button>
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          Back to sign in
        </button>
      ) : null}
    </form>
  );
}
