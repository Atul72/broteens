export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    options: { cause?: unknown; details?: unknown; expose?: boolean } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = options.details;
    this.expose = options.expose ?? statusCode < 500;
  }
}

export function toApiError(
  error: unknown,
  requestId?: string,
): {
  statusCode: number;
  body: ApiErrorBody;
} {
  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_ERROR", "An unexpected error occurred", {
          cause: error,
          expose: false,
        });

  const body: ApiErrorBody = {
    error: {
      code: appError.code,
      message: appError.expose
        ? appError.message
        : "An unexpected error occurred",
    },
  };
  if (appError.expose && appError.details !== undefined) {
    body.error.details = appError.details;
  }
  if (requestId) body.error.requestId = requestId;
  return { statusCode: appError.statusCode, body };
}

type ErrorResponse = {
  status(code: number): ErrorResponse;
  json(body: ApiErrorBody): unknown;
};
type ErrorRequest = { id?: string; headers?: Record<string, unknown> };
type Next = (error?: unknown) => void;

/** Express-compatible terminal error middleware. Register it after all routes. */
export function globalErrorHandler(
  error: unknown,
  request: ErrorRequest,
  response: ErrorResponse,
  _next: Next,
): unknown {
  const headerId = request.headers?.["x-request-id"];
  const requestId =
    request.id ?? (typeof headerId === "string" ? headerId : undefined);
  const serialized = toApiError(error, requestId);
  return response.status(serialized.statusCode).json(serialized.body);
}

/** Frontend-safe parser for errors returned by this API. */
export function getApiErrorMessage(
  value: unknown,
  fallback = "Request failed",
): string {
  if (!value || typeof value !== "object" || !("error" in value))
    return fallback;
  const nested = value.error;
  if (!nested || typeof nested !== "object" || !("message" in nested)) {
    return fallback;
  }
  return typeof nested.message === "string" ? nested.message : fallback;
}
