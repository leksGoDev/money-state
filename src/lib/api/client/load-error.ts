import { ZodError } from "zod";

import { ApiError } from "@/lib/api/server/errors";

export function toPageLoadErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ZodError) {
    return "Invalid query parameters.";
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
