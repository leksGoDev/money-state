export async function ensureApiResponseOk(
  response: Response,
  fallbackMessage: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  let message = fallbackMessage;

  try {
    const payload = (await response.json()) as {
      error?: {
        message?: string;
      };
    };

    message = payload.error?.message ?? fallbackMessage;
  } catch {}

  throw new Error(message);
}
