import { ensureApiResponseOk } from "@/lib/api/client/response";
import type { ObligationDirection } from "@/domain/types/obligation";
import {
  apiPaths,
  obligationCancelApiPath,
  obligationResolveApiPath,
} from "@/lib/routes/api";

type Period = {
  year: number;
  month: number;
};

type CreateObligationPayload = {
  title: FormDataEntryValue | null;
  amount: FormDataEntryValue | null;
  currency: FormDataEntryValue | null;
  direction: FormDataEntryValue | null;
  expectedYear: FormDataEntryValue | null;
  expectedMonth: FormDataEntryValue | null;
  activeFrom: Period;
};

export async function createObligationViaApi(
  payload: CreateObligationPayload,
): Promise<void> {
  const response = await fetch(apiPaths.obligations, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      amount: payload.amount,
      currency: payload.currency,
      direction: payload.direction,
      activeFromYear: payload.activeFrom.year,
      activeFromMonth: payload.activeFrom.month,
      expectedYear: payload.expectedYear ? Number(payload.expectedYear) : null,
      expectedMonth: payload.expectedMonth ? Number(payload.expectedMonth) : null,
    }),
  });

  await ensureApiResponseOk(response, "Unable to create obligation.");
}

export async function resolveObligationViaApi(params: {
  obligationId: string;
  mode: "closed" | "converted";
  direction: ObligationDirection;
  period: Period;
}): Promise<void> {
  const response = await fetch(obligationResolveApiPath(params.obligationId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      params.mode === "closed"
        ? {
            resolution: "closed",
            resolvedYear: params.period.year,
            resolvedMonth: params.period.month,
          }
        : {
            resolution: "converted",
            resolvedYear: params.period.year,
            resolvedMonth: params.period.month,
            confirmed: {
              title:
                params.direction === "receive" ? "Converted income" : "Converted expense",
            },
          },
    ),
  });

  await ensureApiResponseOk(response, "Unable to resolve obligation.");
}

export async function cancelObligationViaApi(params: {
  obligationId: string;
  period: Period;
}): Promise<void> {
  const response = await fetch(obligationCancelApiPath(params.obligationId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resolvedYear: params.period.year,
      resolvedMonth: params.period.month,
    }),
  });

  await ensureApiResponseOk(response, "Unable to cancel obligation.");
}
