"use client";

// Batch email: draft with {{merge tags}}, preview per applicant, test-send to
// yourself, then a confirmed batch send (one Resend call per recipient,
// throttled client-side). Draft persists to localStorage.

import { useEffect, useMemo, useState } from "react";
import { STATUSES, type Applicant } from "@/lib/review/fields";
import { MERGE_TAGS, renderTemplate } from "@/lib/review/merge";

const LS_KEY = "surplus-email-draft-v1";
const SEND_GAP_MS = 600; // Resend free tier allows 2 req/s

const FROM_OPTIONS = [
  "Surplus <surplus@manifund.org>",
  "Austin Chen <austin@manifund.org>",
];

type Draft = {
  from: string;
  customFrom: string;
  subject: string;
  body: string;
  statusFilter: string;
  testTo: string;
};

const DEFAULT_DRAFT: Draft = {
  from: FROM_OPTIONS[0],
  customFrom: "",
  subject: "Your Surplus application",
  body: `Hi {{First name}},

Thanks for applying to Surplus! For your records, here's a copy of your application responses:

----------------------------------------

{{ALL_RESPONSES}}

----------------------------------------

Warmly,
Austin`,
  statusFilter: "all",
  testTo: "austin@manifund.org",
};

type SendResult = {
  recordId: string;
  name: string;
  to: string;
  status: "pending" | "sending" | "sent" | "error";
  error?: string;
};

export default function EmailPage() {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [loaded, setLoaded] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [previewIndex, setPreviewIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [testStatus, setTestStatus] = useState("");
  const [results, setResults] = useState<SendResult[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setDraft({ ...DEFAULT_DRAFT, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
    fetch("/api/review/applicants")
      .then((r) => r.json())
      .then((d) => setApplicants(d.applicants ?? []));
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_KEY, JSON.stringify(draft));
  }, [draft, loaded]);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const from = draft.from === "custom" ? draft.customFrom.trim() : draft.from;

  // audience: status filter, must have an email, dedupe by address, minus
  // manual exclusions
  const audience = useMemo(() => {
    let list = applicants;
    if (draft.statusFilter === "none") list = list.filter((a) => !a.status);
    else if (draft.statusFilter !== "all")
      list = list.filter((a) => a.status === draft.statusFilter);
    const seen = new Set<string>();
    return list.filter((a) => {
      const email = a.email.trim().toLowerCase();
      if (!email || seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }, [applicants, draft.statusFilter]);

  const recipients = audience.filter((a) => !excluded.has(a.id));
  const preview = recipients[Math.min(previewIndex, Math.max(recipients.length - 1, 0))];

  async function sendOne(a: Applicant, overrideTo?: string) {
    const res = await fetch("/api/review/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordId: a.id,
        from,
        subject: draft.subject,
        body: draft.body,
        overrideTo,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data;
  }

  async function testSend() {
    if (!preview || !draft.testTo.trim()) return;
    setTestStatus("sending…");
    try {
      await sendOne(preview, draft.testTo.trim());
      setTestStatus(`sent to ${draft.testTo.trim()} ✓ (rendered as ${preview.name})`);
    } catch (e) {
      setTestStatus(`failed: ${e}`);
    }
  }

  async function batchSend() {
    setConfirming(false);
    setSending(true);
    const queue: SendResult[] = recipients.map((a) => ({
      recordId: a.id,
      name: a.name,
      to: a.email,
      status: "pending",
    }));
    setResults(queue);
    for (const a of recipients) {
      setResults((prev) =>
        prev.map((r) => (r.recordId === a.id ? { ...r, status: "sending" } : r))
      );
      try {
        await sendOne(a);
        setResults((prev) =>
          prev.map((r) => (r.recordId === a.id ? { ...r, status: "sent" } : r))
        );
      } catch (e) {
        setResults((prev) =>
          prev.map((r) =>
            r.recordId === a.id ? { ...r, status: "error", error: String(e) } : r
          )
        );
      }
      await new Promise((res) => setTimeout(res, SEND_GAP_MS));
    }
    setSending(false);
  }

  const sentCount = results.filter((r) => r.status === "sent").length;
  const errCount = results.filter((r) => r.status === "error").length;

  return (
    <main className="pt-6">
      <h1 className="font-display text-2xl text-ink-dark">Batch Email</h1>
      <p className="mt-1 font-mono text-sm text-ink-dark/60">
        Draft → preview per applicant → test-send → send. Via Resend.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* draft panel */}
        <div>
          <label className="font-mono text-sm">From</label>
          <select
            value={draft.from}
            onChange={(e) => set({ from: e.target.value })}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          >
            {FROM_OPTIONS.map((f) => (
              <option key={f}>{f}</option>
            ))}
            <option value="custom">custom…</option>
          </select>
          {draft.from === "custom" && (
            <input
              value={draft.customFrom}
              onChange={(e) => set({ customFrom: e.target.value })}
              placeholder="Name <addr@manifund.org>"
              className="mt-2 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
            />
          )}

          <label className="mt-3 block font-mono text-sm">Subject</label>
          <input
            value={draft.subject}
            onChange={(e) => set({ subject: e.target.value })}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          />

          <label className="mt-3 block font-mono text-sm">Body (plain text)</label>
          <textarea
            value={draft.body}
            onChange={(e) => set({ body: e.target.value })}
            rows={14}
            className="mt-1 w-full resize-y border-2 border-ink-dark/40 bg-paper p-2 font-mono text-xs leading-relaxed outline-none focus:border-ink-pink"
          />
          <details className="mt-1 font-mono text-xs text-ink-dark/60">
            <summary className="cursor-pointer">merge tags</summary>
            <p className="mt-1 leading-relaxed">
              {MERGE_TAGS.map((t) => `{{${t}}}`).join("  ")}
            </p>
          </details>

          <label className="mt-4 block font-mono text-sm">Audience</label>
          <select
            value={draft.statusFilter}
            onChange={(e) => {
              set({ statusFilter: e.target.value });
              setExcluded(new Set());
              setPreviewIndex(0);
            }}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          >
            <option value="all">All applicants (with an email, deduped)</option>
            <option value="none">No status</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <details className="mt-2 border-2 border-ink-dark/30 p-2">
            <summary className="cursor-pointer font-mono text-sm">
              {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
              {excluded.size > 0 && ` (${excluded.size} excluded)`}
            </summary>
            <div className="mt-2 max-h-56 overflow-y-auto">
              {audience.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 py-0.5 font-mono text-xs"
                >
                  <input
                    type="checkbox"
                    checked={!excluded.has(a.id)}
                    onChange={(e) => {
                      const next = new Set(excluded);
                      if (e.target.checked) next.delete(a.id);
                      else next.add(a.id);
                      setExcluded(next);
                    }}
                  />
                  {a.name} <span className="text-ink-dark/50">{a.email}</span>
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* preview + send panel */}
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-sm">
              Preview{preview ? `: ${preview.name}` : ""}
            </label>
            <span className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
                disabled={previewIndex === 0}
                className="border border-ink-dark/40 px-2 py-0.5 disabled:opacity-30"
              >
                ←
              </button>
              {recipients.length === 0 ? "0 / 0" : `${previewIndex + 1} / ${recipients.length}`}
              <button
                onClick={() =>
                  setPreviewIndex((i) => Math.min(recipients.length - 1, i + 1))
                }
                disabled={previewIndex >= recipients.length - 1}
                className="border border-ink-dark/40 px-2 py-0.5 disabled:opacity-30"
              >
                →
              </button>
            </span>
          </div>
          <div className="mt-1 border-2 border-ink-dark bg-paper-deep p-3 font-mono text-xs">
            {preview ? (
              <>
                <p className="text-ink-dark/60">
                  From: {from || "(set a from address)"}
                  <br />
                  To: {preview.email}
                  <br />
                  Subject: {renderTemplate(draft.subject, preview)}
                </p>
                <hr className="my-2 border-ink-dark/20" />
                <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {renderTemplate(draft.body, preview)}
                </pre>
              </>
            ) : (
              <p className="text-ink-dark/50">No recipients selected.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              value={draft.testTo}
              onChange={(e) => set({ testTo: e.target.value })}
              placeholder="test address"
              className="w-56 border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
            />
            <button
              onClick={testSend}
              disabled={!preview || !from || !draft.testTo.trim()}
              className="border-2 border-ink-dark px-3 py-1.5 font-condensed text-base tracking-wide hover:bg-ink-dark hover:text-paper disabled:opacity-40"
            >
              TEST SEND
            </button>
            {testStatus && (
              <span className="font-mono text-xs text-ink-dark/70">{testStatus}</span>
            )}
          </div>

          <div className="mt-4 border-t-2 border-ink-dark/20 pt-4">
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                disabled={sending || recipients.length === 0 || !from}
                className="border-2 border-ink-dark bg-ink-blue px-4 py-2 font-condensed text-lg tracking-wide text-paper hover:bg-ink-pink disabled:opacity-40"
              >
                SEND TO {recipients.length} APPLICANT{recipients.length === 1 ? "" : "S"}…
              </button>
            ) : (
              <div className="border-2 border-ink-red bg-ink-red/10 p-3">
                <p className="font-mono text-sm">
                  Really send this email to <b>{recipients.length}</b> real
                  applicant{recipients.length === 1 ? "" : "s"} from{" "}
                  <b>{from}</b>? This cannot be undone.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={batchSend}
                    className="border-2 border-ink-dark bg-ink-red px-3 py-1.5 font-condensed text-base tracking-wide text-paper"
                  >
                    YES, SEND ALL
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="border-2 border-ink-dark px-3 py-1.5 font-condensed text-base tracking-wide"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-3">
                <p className="font-mono text-sm">
                  {sentCount} sent
                  {errCount > 0 && <span className="text-ink-red"> · {errCount} failed</span>}
                  {sending && " · sending…"}
                </p>
                <div className="mt-1 max-h-64 overflow-y-auto border-2 border-ink-dark/40">
                  {results.map((r) => (
                    <div
                      key={r.recordId}
                      className="flex items-center gap-2 border-b border-ink-dark/10 px-2 py-1 font-mono text-xs last:border-b-0"
                    >
                      <span>{r.name}</span>
                      <span className="text-ink-dark/50">{r.to}</span>
                      <span className="ml-auto">
                        {r.status === "pending" && <span className="text-ink-dark/40">queued</span>}
                        {r.status === "sending" && <span className="text-ink-blue">sending…</span>}
                        {r.status === "sent" && <span className="text-ink-green">sent ✓</span>}
                        {r.status === "error" && (
                          <span className="text-ink-red" title={r.error}>failed</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
