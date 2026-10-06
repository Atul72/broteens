"use client";

import { useCallback } from "react";

import { useAsyncAction } from "@broteens/hooks";
import { Alert, Button, FormField, Input } from "@repo/ui";
import { useForm } from "react-hook-form";

export interface ProfileSettingsValues {
  avatarUrl: string;
  email: string;
  fullName: string;
}

export interface ProfileSettingsFormProps {
  initialValues: ProfileSettingsValues;
  onSave: (values: ProfileSettingsValues) => Promise<void>;
}

export function ProfileSettingsForm({
  initialValues,
  onSave,
}: ProfileSettingsFormProps) {
  const saveProfile = useCallback(
    async (values: ProfileSettingsValues) => onSave(values),
    [onSave],
  );
  const { data, error, execute, isPending } = useAsyncAction(saveProfile);
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileSettingsValues>({ defaultValues: initialValues });

  return (
    <form
      className="max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(async (values) => {
        try {
          await execute(values);
          reset(values);
        } catch {
          // The hook exposes the normalized error below.
        }
      })}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Profile details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update the information shown on your account.
        </p>
      </div>
      <FormField
        htmlFor="profile-email"
        label="Email address"
        hint="Email changes should use a separate verification flow."
      >
        <Input
          id="profile-email"
          type="email"
          disabled
          {...register("email")}
        />
      </FormField>
      <FormField
        htmlFor="profile-name"
        label="Full name"
        error={errors.fullName?.message}
      >
        <Input
          id="profile-name"
          autoComplete="name"
          disabled={isPending}
          hasError={Boolean(errors.fullName)}
          {...register("fullName", {
            required: "Full name is required",
            minLength: { value: 2, message: "Use at least 2 characters" },
          })}
        />
      </FormField>
      <FormField
        htmlFor="avatar-url"
        label="Avatar URL"
        error={errors.avatarUrl?.message}
      >
        <Input
          id="avatar-url"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          disabled={isPending}
          hasError={Boolean(errors.avatarUrl)}
          {...register("avatarUrl", {
            pattern: {
              value: /^https?:\/\/.+/i,
              message: "Enter a valid image URL",
            },
          })}
        />
      </FormField>
      {error ? <Alert variant="error">{error.message}</Alert> : null}
      {data !== null ? (
        <Alert variant="success">Profile saved successfully.</Alert>
      ) : null}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={!isDirty || isPending}
          onClick={() => reset()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty} isLoading={isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
