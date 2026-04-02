import { ensureApiResponseOk } from "@/lib/api/client/response";
import { apiPaths } from "@/lib/routes/api";

type RegisterPayload = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
};

export async function registerViaApi(payload: RegisterPayload): Promise<void> {
  const response = await fetch(apiPaths.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await ensureApiResponseOk(response, "Failed to register.");
}
