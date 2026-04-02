"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { currencyValues } from "@/domain/types/money";
import { getCurrentYearMonth } from "@/lib/date/period";
import { createConfirmedViaApi } from "@/modules/confirmed/requests";
import type { ConfirmedEndpoint } from "@/modules/confirmed/shared";

type CreateConfirmedFormProps = {
  endpoint: ConfirmedEndpoint;
  label: string;
};

export function CreateConfirmedForm({ endpoint, label }: CreateConfirmedFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultCurrency = currencyValues[0];

  async function onSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const period = getCurrentYearMonth();

    try {
      await createConfirmedViaApi({
        endpoint,
        title: formData.get("title"),
        amount: formData.get("amount"),
        currency: formData.get("currency"),
        year: period.year,
        month: period.month,
      });

      router.refresh();
    } catch (submitError) {
      const fallback = `Unable to create ${label.toLowerCase()}.`;
      const message = submitError instanceof Error ? submitError.message : fallback;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-2 rounded-2xl border border-line bg-background p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Create {label}
      </p>
      <input
        required
        name="title"
        placeholder={`${label} title`}
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          required
          type="number"
          min="0.01"
          step="0.01"
          name="amount"
          placeholder="Amount"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        />
        <select
          name="currency"
          defaultValue={defaultCurrency}
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        >
          {currencyValues.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-xs text-warning">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {loading ? "Saving..." : `Add ${label}`}
      </button>
    </form>
  );
}
