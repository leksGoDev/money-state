export async function ensureApiResponseOk(
  response: Response,
  fallbackMessage: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  let message = fallbackMessage;

  const payload = (await response.clone().json().catch(() => null)) as
    | {
        error?: {
          message?: string;
        };
      }
    | null;

  message = payload?.error?.message ?? fallbackMessage;

  throw new Error(message);
}
