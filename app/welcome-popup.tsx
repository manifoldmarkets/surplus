"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "surplus-welcome-seen";
const COUNTDOWN_SECONDS = 3;

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  // Only show the very first time someone visits.
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — show it anyway.
      setOpen(true);
    }
  }, []);

  // Count down from 3 to 0 once the popup is open.
  useEffect(() => {
    if (!open || remaining <= 0) return;
    const id = setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [open, remaining]);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  const ready = remaining <= 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
      className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto p-5 max-sm:p-3"
    >
      {/* scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-dark/70"
        onClick={ready ? dismiss : undefined}
      />

      {/* card */}
      <div className="relative w-full max-w-[460px] -rotate-1 border-[3px] border-ink-dark bg-paper shadow-[10px_10px_0_var(--color-ink-blue)]">
        <span
          aria-hidden="true"
          className="halftone pointer-events-none absolute -right-3 -top-3 h-16 w-16 opacity-70 mix-blend-multiply [--dot-gap:9px] [--dot:2.4px]"
        />

        <div className="px-7 pb-7 pt-6 max-sm:px-5 max-sm:pb-5 max-sm:pt-5">
          <h2
            id="welcome-popup-title"
            className="misreg m-0 font-display text-4xl leading-[0.9] tracking-[-0.03em] text-ink-dark max-sm:text-3xl"
          >
            WELCOME!
          </h2>

          <p className="mt-4 font-serif text-lg leading-relaxed text-ink-dark max-sm:mt-3 max-sm:text-base [&_em]:italic [&_em]:text-ink-blue [&_mark]:bg-ink-yellow [&_mark]:px-1 [&_mark]:text-ink-dark">
            For now, please consider this a <mark>mockup</mark>;
            we haven&rsquo;t officially launched yet and so the details may{" "}
            change a lot~
          </p>

          <p className="mt-3 text-right font-display text-xl tracking-[-0.02em] text-ink-pink max-sm:mt-2 max-sm:text-lg">
            &ndash;&nbsp;Austin
          </p>

          <button
            type="button"
            onClick={dismiss}
            disabled={!ready}
            className="mt-6 w-full border-[3px] border-ink-dark bg-ink-pink px-5 py-3.5 font-condensed text-2xl font-bold uppercase tracking-wide text-paper max-sm:mt-5 max-sm:py-3 max-sm:text-xl transition-[transform,box-shadow,opacity] duration-150 ease-out enabled:cursor-pointer enabled:shadow-[5px_5px_0_var(--color-ink-blue)] enabled:hover:-translate-x-[2px] enabled:hover:-translate-y-[2px] enabled:hover:shadow-[7px_7px_0_var(--color-ink-blue)] enabled:active:translate-x-[2px] enabled:active:translate-y-[2px] enabled:active:shadow-[2px_2px_0_var(--color-ink-blue)] disabled:cursor-default disabled:bg-ink-dark disabled:opacity-80"
          >
            {ready ? (
              "Got it"
            ) : (
              <span className="tabular-nums">{remaining}…</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
