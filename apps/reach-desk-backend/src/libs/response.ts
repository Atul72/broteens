import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export function sendSuccess<T>(
  response: Response,
  data?: T,
  message?: string,
  statusCode = 200,
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
  };
  return response.status(statusCode).json(payload);
}
