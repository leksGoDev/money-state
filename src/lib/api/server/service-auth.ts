import { ApiError, unauthorized } from "@/lib/api/server/errors";

const serviceAuthScheme = "Bearer ";

function parseBearerToken(authorizationHeader: string): string | null {
  if (!authorizationHeader.startsWith(serviceAuthScheme)) {
    return null;
  }

  const token = authorizationHeader.slice(serviceAuthScheme.length).trim();
  return token.length > 0 ? token : null;
}

export function requireServiceAuthorization(request: Request): void {
  const serviceApiToken = process.env.SERVICE_API_TOKEN?.trim();

  if (!serviceApiToken) {
    throw new ApiError({
      status: 503,
      code: "SERVICE_API_NOT_CONFIGURED",
      message: "Service API token is not configured.",
    });
  }

  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    unauthorized("Missing service authorization.");
  }

  const providedToken = parseBearerToken(authorizationHeader);
  if (!providedToken || providedToken !== serviceApiToken) {
    unauthorized("Invalid service authorization.");
  }
}
