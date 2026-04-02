"use client";

import { useState } from "react";

import { currencyValues } from "@/domain/types/money";
import { getCurrentYearMonth } from "@/lib/date/period";
import { createObligationViaApi } from "@/modules/obligations/requests";

export function CreateObligationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultCurrency = currencyValues[0];

  async function onSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const period = getCurrentYearMonth();

    try {
      await createObligationViaApi({
        title: formData.get("title"),
        amount: formData.get("amount"),
        currency: formData.get("currency"),
        direction: formData.get("direction"),
        expectedYear: formData.get("expectedYear"),
        expectedMonth: formData.get("expectedMonth"),
        activeFrom: period,
      });

      window.location.reload();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create obligation.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-2 rounded-2xl border border-line bg-background p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Add obligation
      </p>
      <input
        required
        name="title"
        placeholder="Obligation title"
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
      <select
        name="direction"
        defaultValue="pay"
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
      >
        <option value="pay">Pay</option>
        <option value="receive">Receive</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          name="expectedYear"
          type="number"
          min="1970"
          max="2200"
          placeholder="Expected year"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        />
        <input
          name="expectedMonth"
          type="number"
          min="1"
          max="12"
          placeholder="Expected month"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        />
      </div>
      {error ? <p className="text-xs text-warning">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add obligation"}
      </button>
    </form>
  );
}
