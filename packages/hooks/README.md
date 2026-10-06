# Shared hooks

Framework-neutral React hooks shared across apps and features.

- `useAsyncAction`: pending, result, and error state for promise-based actions.
- `useDisclosure`: open, close, and toggle state.
- `useLocalStorage`: typed persistent client state.

Hooks containing feature language or API knowledge should stay in that feature
instead of this package.
