# Features

Feature folders own complete user workflows: their components, feature-specific
hooks, API calls, validation, and types.

```text
src/
  authentication/
    api.ts
    login-form.tsx
    signup-form.tsx
    forgot-password-form.tsx
    reset-password-form.tsx
    use-auth-session.ts
  settings/
    profile-settings-form.tsx
```

Keep a component here when it knows business language such as authentication,
profiles, tokens, or price alerts. Move it to `@repo/ui` only when it is a small,
business-agnostic primitive that several features can reuse.

Generic stateful React behavior belongs in `@broteens/hooks`. Feature-specific
hooks remain beside their feature.
