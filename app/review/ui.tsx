"use client";

// Small shared client widgets for the review dashboard.

import { useState } from "react";
import { STATUSES, type Applicant, type Status } from "@/lib/review/fields";

export async function patchApplicant(
  id: string,
  patch: Record<string, unknown>
): Promise<Applicant> {
  const res = await fetch(`/api/review/applicants/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data.applicant as Applicant;
}

// Rough visual mapping of Airtable's status colors.
export const STATUS_COLORS: Record<Status, string> = {
  "Needs score": "bg-ink-green/20 text-ink-green",
  "To add notes": "bg-ink-blue/15 text-ink-blue",
  "To desk reject": "bg-ink-pink/15 text-ink-pink",
  "To email for interview": "bg-ink-blue/25 text-ink-blue",
  "Emailed for interview": "bg-ink-yellow/40 text-ink-dark",
  "Interview scheduled": "bg-ink-yellow/60 text-ink-dark",
  Interviewed: "bg-ink-green/25 text-ink-green",
  "Acceptance sent": "bg-ink-green/40 text-ink-green",
  Confirmed: "bg-ink-green/60 text-paper",
  Rejected: "bg-ink-red/20 text-ink-red",
  Declined: "bg-ink-red/30 text-ink-red",
  Duplicate: "bg-ink-dark/10 text-ink-dark/60",
};

export function StatusBadge({ status }: { status: Status | null }) {
  if (!status)
    return <span className="font-mono text-xs text-ink-dark/40">—</span>;
  return (
    <span
      className={`inline-block whitespace-nowrap px-1.5 py-0.5 font-mono text-xs ${STATUS_COLORS[status] ?? "bg-ink-dark/10"}`}
    >
      {status}
    </span>
  );
}

// Inline-editable status select; saves to Airtable on change.
export function StatusSelect({
  applicant,
  onSaved,
  className = "",
}: {
  applicant: Applicant;
  onSaved?: (a: Applicant) => void;
  className?: string;
}) {
  const [value, setValue] = useState<string>(applicant.status ?? "");
  const [saving, setSaving] = useState(false);

  // resync if the applicant's status changes from elsewhere on the page
  const [seen, setSeen] = useState(applicant.status ?? "");
  if (seen !== (applicant.status ?? "")) {
    setSeen(applicant.status ?? "");
    setValue(applicant.status ?? "");
  }

  async function change(next: string) {
    const prev = value;
    setValue(next);
    setSaving(true);
    try {
      const updated = await patchApplicant(applicant.id, { status: next || null });
      onSaved?.(updated);
    } catch (e) {
      setValue(prev);
      alert(`Failed to save status: ${e}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => change(e.target.value)}
      className={`border border-ink-dark/30 bg-paper px-1 py-0.5 font-mono text-xs outline-none focus:border-ink-pink disabled:opacity-50 ${className}`}
    >
      <option value="">— no status —</option>
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

// 1-5 star rating; click a star to set, click the current value to clear.
export function StarRating({
  applicant,
  onSaved,
}: {
  applicant: Applicant;
  onSaved?: (a: Applicant) => void;
}) {
  const [value, setValue] = useState<number | null>(applicant.austinPrio);
  const [saving, setSaving] = useState(false);

  // resync if the applicant's rating changes from elsewhere on the page
  const [seen, setSeen] = useState(applicant.austinPrio);
  if (seen !== applicant.austinPrio) {
    setSeen(applicant.austinPrio);
    setValue(applicant.austinPrio);
  }

  async function set(n: number) {
    const next = value === n ? null : n;
    const prev = value;
    setValue(next);
    setSaving(true);
    try {
      const updated = await patchApplicant(applicant.id, { austinPrio: next });
      onSaved?.(updated);
    } catch (e) {
      setValue(prev);
      alert(`Failed to save rating: ${e}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <span
      className={`whitespace-nowrap text-lg leading-none ${saving ? "opacity-50" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={saving}
          onClick={() => set(n)}
          title={`${n} star${n > 1 ? "s" : ""}`}
          className={`cursor-pointer ${
            value != null && n <= value ? "text-ink-yellow" : "text-ink-dark/20"
          } hover:text-ink-pink`}
          style={{ textShadow: value != null && n <= value ? "0 0 1px var(--color-ink-dark)" : undefined }}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export function prioFmt(n: number | null): string {
  return n == null ? "—" : String(Math.round(n * 10) / 10);
}

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}
