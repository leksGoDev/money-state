"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerViaApi } from "@/modules/auth/requests";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      await registerViaApi({
        email,
        password,
        name: formData.get("name"),
      });

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Account created, but automatic sign-in failed.");
      }

      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to register.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-2xl border border-line bg-background p-4">
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Name
        </label>
        <input
          name="name"
          placeholder="Alex"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          placeholder="user@example.com"
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Password
        </label>
        <input
          required
          type="password"
          name="password"
          minLength={8}
          className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-warning">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
