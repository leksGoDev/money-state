"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { currencyValues, type Currency } from "@/domain/types/money";
import { updateSettingsViaApi } from "@/modules/settings/requests";

type BaseCurrencyFormProps = {
  value: Currency;
};

export function BaseCurrencyForm({ value }: BaseCurrencyFormProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState(value);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    try {
      await updateSettingsViaApi(currency);
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-2xl border border-line bg-background p-4">
      <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Base currency
      </label>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as BaseCurrencyFormProps["value"])}
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
      >
        {currencyValues.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {status === "saving" ? "Saving..." : "Save"}
      </button>
      {status === "error" ? (
        <p className="text-xs text-warning">Could not update settings.</p>
      ) : null}
    </form>
  );
}
