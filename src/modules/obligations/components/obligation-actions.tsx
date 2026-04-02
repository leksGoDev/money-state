"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  ObligationDirection,
  ObligationStatus,
} from "@/domain/types/obligation";
import { getCurrentYearMonth } from "@/lib/date/period";
import {
  cancelObligationViaApi,
  resolveObligationViaApi,
} from "@/modules/obligations/requests";

type ObligationActionsProps = {
  obligationId: string;
  direction: ObligationDirection;
  status: ObligationStatus;
};

export function ObligationActions({
  obligationId,
  direction,
  status,
}: ObligationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "resolve" | "cancel">(null);
  const [error, setError] = useState<string | null>(null);

  if (status !== "active") {
    return (
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {status}
      </p>
    );
  }

  async function resolve(mode: "closed" | "converted") {
    setLoading("resolve");
    setError(null);
    const period = getCurrentYearMonth();

    try {
      await resolveObligationViaApi({
        obligationId,
        mode,
        direction,
        period,
      });
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to resolve obligation.";
      setError(message);
    } finally {
      setLoading(null);
    }
  }

  async function cancel() {
    setLoading("cancel");
    setError(null);
    const period = getCurrentYearMonth();

    try {
      await cancelObligationViaApi({ obligationId, period });
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to cancel obligation.";
      setError(message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => resolve("closed")}
          disabled={loading !== null}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted-foreground disabled:opacity-60"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => resolve("converted")}
          disabled={loading !== null}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted-foreground disabled:opacity-60"
        >
          Convert
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={loading !== null}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-warning disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      {error ? <p className="text-xs text-warning">{error}</p> : null}
    </>
  );
}
