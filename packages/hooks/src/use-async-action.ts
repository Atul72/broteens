"use client";

import { useCallback, useState } from "react";

export interface AsyncActionState<TResult> {
  data: TResult | null;
  error: Error | null;
  isPending: boolean;
}

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<AsyncActionState<TResult>>({
    data: null,
    error: null,
    isPending: false,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setState((current) => ({ ...current, error: null, isPending: true }));
      try {
        const data = await action(...args);
        setState({ data, error: null, isPending: false });
        return data;
      } catch (value) {
        const error =
          value instanceof Error ? value : new Error("Something went wrong");
        setState({ data: null, error, isPending: false });
        throw error;
      }
    },
    [action],
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isPending: false });
  }, []);

  return { ...state, execute, reset };
}
