import type { Currency } from "@/domain/types/money";
import { ensureApiResponseOk } from "@/lib/api/client/response";

export async function updateSettingsViaApi(baseCurrency: Currency): Promise<void> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ baseCurrency }),
  });

  await ensureApiResponseOk(response, "Could not update settings.");
}
