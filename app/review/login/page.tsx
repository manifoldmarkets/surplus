"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/review/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/review");
      router.refresh();
    } else {
      setError("Wrong password");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border-2 border-ink-dark bg-paper-deep p-8 shadow-[6px_6px_0_var(--color-ink-blue)]"
      >
        <h1 className="font-display text-2xl text-ink-blue misreg-pink">
          SURPLUS
        </h1>
        <p className="mt-1 font-mono text-sm text-ink-dark/70">
          application review · restricted
        </p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full border-2 border-ink-dark bg-paper px-3 py-2 font-mono text-base outline-none focus:border-ink-pink"
        />
        {error && (
          <p className="mt-2 font-mono text-sm text-ink-red">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full border-2 border-ink-dark bg-ink-blue px-3 py-2 font-condensed text-lg tracking-wide text-paper hover:bg-ink-pink disabled:opacity-50"
        >
          {busy ? "…" : "ENTER"}
        </button>
      </form>
    </main>
  );
}
