import type { ErrorRequestHandler } from "express";
import { AppError, globalErrorHandler } from "@broteens/errors";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  if (!(error instanceof AppError) || error.statusCode >= 500) {
    console.error("[reach-desk-backend] Request failed", {
      error,
      method: request.method,
      path: request.path,
      requestId: response.locals.requestId,
    });
  }
  void globalErrorHandler(error, request, response, next);
};
