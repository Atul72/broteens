import { describe, expect, it } from "vitest";

import {
  AppError,
  getApiErrorMessage,
  toApiError,
} from "../src/index.js";

describe("shared API errors", () => {
  it("serializes expected errors with details", () => {
    expect(
      toApiError(
        new AppError(400, "VALIDATION_ERROR", "Invalid input", {
          details: [{ path: "email", message: "Invalid" }],
        }),
        "request-1",
      ),
    ).toEqual({
      statusCode: 400,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: [{ path: "email", message: "Invalid" }],
          requestId: "request-1",
        },
      },
    });
  });

  it("does not leak unexpected server errors", () => {
    const result = toApiError(new Error("database password leaked"));
    expect(result.statusCode).toBe(500);
    expect(result.body.error.message).toBe("An unexpected error occurred");
  });

  it("extracts API messages for frontend consumers", () => {
    expect(getApiErrorMessage({ error: { message: "Try again" } })).toBe(
      "Try again",
    );
    expect(getApiErrorMessage(null)).toBe("Request failed");
  });
});
