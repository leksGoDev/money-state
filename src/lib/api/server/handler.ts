import { ZodError } from "zod";

import { ApiError } from "@/lib/api/server/errors";
import { fail } from "@/lib/api/server/response";

export async function handleApi<T>(
  action: () => Promise<T>,
): Promise<Response> {
  try {
    const result = await action();
    return result as Response;
  } catch (error) {
    if (error instanceof ApiError) {
      return fail({
        status: error.status,
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof ZodError) {
      return fail({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
        details: error.flatten(),
      });
    }

    return fail({
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error.",
    });
  }
}
