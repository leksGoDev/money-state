import { ensureApiResponseOk } from "@/lib/api/client/response";
import type { ConfirmedEndpoint } from "@/modules/confirmed/shared";

type CreateConfirmedPayload = {
  endpoint: ConfirmedEndpoint;
  title: FormDataEntryValue | null;
  amount: FormDataEntryValue | null;
  currency: FormDataEntryValue | null;
  year: number;
  month: number;
};

export async function createConfirmedViaApi(
  payload: CreateConfirmedPayload,
): Promise<void> {
  const response = await fetch(payload.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      amount: payload.amount,
      currency: payload.currency,
      timingType: "single",
      year: payload.year,
      month: payload.month,
    }),
  });
  await ensureApiResponseOk(response, "Unable to create item.");
}
