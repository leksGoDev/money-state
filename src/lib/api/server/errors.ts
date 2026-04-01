export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}

export function badRequest(message: string, details?: unknown): never {
  throw new ApiError({
    status: 400,
    code: "BAD_REQUEST",
    message,
    details,
  });
}

export function unauthorized(message = "Unauthorized"): never {
  throw new ApiError({
    status: 401,
    code: "UNAUTHORIZED",
    message,
  });
}

export function notFound(message = "Not found"): never {
  throw new ApiError({
    status: 404,
    code: "NOT_FOUND",
    message,
  });
}

export function conflict(message: string): never {
  throw new ApiError({
    status: 409,
    code: "CONFLICT",
    message,
  });
}
