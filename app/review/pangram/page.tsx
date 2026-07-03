"use client";

// Pangram AI-detection pipeline: runs each applicant's main idea through
// Pangram (3 concurrent). Full responses are stored in InstantDB
// (`pangramResults`) and the fraction_ai score is written to Airtable as
// "Pangram AI fraction". Config persists to localStorage.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PANGRAM_FIELD_NAME, STATUSES, type Applicant } from "@/lib/review/fields";

const LS_KEY = "surplus-pangram-config-v1";
const CONCURRENCY = 3;

type RunResult = {
  recordId: string;
  name: string;
  status: "pending" | "running" | "done" | "error";
  fractionAi?: number;
  predictionShort?: string;
  dashboardLink?: string | null;
  cached?: boolean;
  error?: string;
};

type Config = {
  statusFilter: string;
  skipDetected: boolean;
  limit: number;
  write: boolean;
};

const DEFAULT_CONFIG: Config = {
  statusFilter: "all",
  skipDetected: true,
  limit: 0,
  write: true,
};

function pangramPct(fraction: number | null | undefined): string {
  if (fraction == null) return "—";
  return `${Math.round(fraction * 100)}% AI`;
}

export default function PangramPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [detected, setDetected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
    fetch("/api/review/applicants")
      .then((r) => r.json())
      .then((d) => setApplicants(d.applicants ?? []));
    refreshDetected();
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_KEY, JSON.stringify(config));
  }, [config, loaded]);

  function refreshDetected() {
    fetch("/api/review/pangram/detected")
      .then((r) => r.json())
      .then((d) => setDetected(new Set(d.detected ?? [])));
  }

  const audience = useMemo(() => {
    let list = applicants.filter((a) => a.mainIdea.trim());
    if (config.statusFilter === "none") list = list.filter((a) => !a.status);
    else if (config.statusFilter !== "all")
      list = list.filter((a) => a.status === config.statusFilter);
    if (config.skipDetected) list = list.filter((a) => !detected.has(a.id));
    if (config.limit > 0) list = list.slice(0, config.limit);
    return list;
  }, [applicants, config.statusFilter, config.skipDetected, config.limit, detected]);

  async function run() {
    if (audience.length === 0) return;
    cancelled.current = false;
    setRunning(true);
    const queue: RunResult[] = audience.map((a) => ({
      recordId: a.id,
      name: a.name,
      status: "pending",
    }));
    setResults(queue);

    let next = 0;
    async function worker() {
      while (!cancelled.current) {
        const i = next++;
        if (i >= queue.length) return;
        const item = queue[i];
        update(item.recordId, { status: "running" });
        try {
          const res = await fetch("/api/review/pangram/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recordId: item.recordId, write: config.write }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
          update(item.recordId, {
            status: "done",
            fractionAi: data.fractionAi,
            predictionShort: data.predictionShort,
            dashboardLink: data.dashboardLink,
            cached: data.cached,
          });
        } catch (e) {
          update(item.recordId, { status: "error", error: String(e) });
        }
      }
    }
    function update(recordId: string, patch: Partial<RunResult>) {
      setResults((prev) =>
        prev.map((r) => (r.recordId === recordId ? { ...r, ...patch } : r))
      );
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setRunning(false);
    // refresh so a rerun skips what just finished
    if (config.skipDetected) refreshDetected();
  }

  const doneCount = results.filter((r) => r.status === "done").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const set = (patch: Partial<Config>) => setConfig((c) => ({ ...c, ...patch }));

  return (
    <main className="pt-6">
      <h1 className="font-display text-2xl text-ink-dark">Pangram AI Detection</h1>
      <p className="mt-1 font-mono text-sm text-ink-dark/60">
        Runs each applicant’s main idea through Pangram. Full responses go to
        InstantDB; the fraction_ai score is written to Airtable as “
        {PANGRAM_FIELD_NAME}”{config.write ? "" : " (dry run: writes disabled)"}.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* config panel */}
        <div className="h-fit border-2 border-ink-dark bg-paper-deep p-4">
          <label className="block font-mono text-sm">Audience</label>
          <select
            value={config.statusFilter}
            onChange={(e) => set({ statusFilter: e.target.value })}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          >
            <option value="all">All statuses</option>
            <option value="none">No status</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="mt-2 flex items-center gap-4 font-mono text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={config.skipDetected}
                onChange={(e) => set({ skipDetected: e.target.checked })}
              />
              skip already checked
            </label>
            <label className="flex items-center gap-1.5">
              limit
              <input
                type="number"
                min={0}
                value={config.limit || ""}
                placeholder="all"
                onChange={(e) => set({ limit: Number(e.target.value) || 0 })}
                className="w-16 border-2 border-ink-dark/40 bg-paper px-1 py-0.5"
              />
            </label>
          </div>
          <label className="mt-2 flex items-center gap-1.5 font-mono text-sm">
            <input
              type="checkbox"
              checked={!config.write}
              onChange={(e) => set({ write: !e.target.checked })}
            />
            dry run (don’t write to Instant/Airtable)
          </label>

          {!running ? (
            <button
              onClick={run}
              disabled={audience.length === 0}
              className="mt-4 w-full border-2 border-ink-dark bg-ink-blue px-3 py-2 font-condensed text-lg tracking-wide text-paper hover:bg-ink-pink disabled:opacity-40"
            >
              CHECK {audience.length} APPLICANT{audience.length === 1 ? "" : "S"}
            </button>
          ) : (
            <button
              onClick={() => (cancelled.current = true)}
              className="mt-4 w-full border-2 border-ink-dark bg-ink-red px-3 py-2 font-condensed text-lg tracking-wide text-paper"
            >
              CANCEL
            </button>
          )}
          <p className="mt-2 font-mono text-xs text-ink-dark/50">
            Each check takes ~5–20s (Pangram tasks are async). Applicants with
            no main-idea text are excluded.
          </p>
        </div>

        {/* results */}
        <div>
          {results.length === 0 && (
            <p className="font-mono text-sm text-ink-dark/50">
              {detected.size} applicant{detected.size === 1 ? " has" : "s have"}{" "}
              a Pangram score already.
            </p>
          )}
          {results.length > 0 && (
            <>
              <div className="flex items-center gap-4 font-mono text-sm">
                <span>
                  {doneCount + errorCount} / {results.length}
                </span>
                <div className="h-2 flex-1 border border-ink-dark/40 bg-paper">
                  <div
                    className="h-full bg-ink-blue"
                    style={{ width: `${((doneCount + errorCount) / results.length) * 100}%` }}
                  />
                </div>
                {errorCount > 0 && (
                  <span className="text-ink-red">{errorCount} errors</span>
                )}
              </div>
              <div className="mt-2 border-2 border-ink-dark">
                {results.map((r) => (
                  <div
                    key={r.recordId}
                    className="border-b border-ink-dark/15 px-3 py-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/review/app/${r.recordId}`}
                        className="font-condensed text-base hover:text-ink-pink"
                      >
                        {r.name || "(no name)"}
                      </Link>
                      {r.status === "done" && r.dashboardLink && (
                        <a
                          href={r.dashboardLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-ink-blue underline hover:text-ink-pink"
                        >
                          dashboard
                        </a>
                      )}
                      <span className="ml-auto font-mono text-sm">
                        {r.status === "pending" && <span className="text-ink-dark/40">queued</span>}
                        {r.status === "running" && <span className="text-ink-blue">checking…</span>}
                        {r.status === "error" && <span className="text-ink-red">error</span>}
                        {r.status === "done" && (
                          <span className="font-bold text-ink-blue">
                            {r.cached && (
                              <span className="font-normal text-ink-dark/40">cached · </span>
                            )}
                            {pangramPct(r.fractionAi)} · {r.predictionShort}
                          </span>
                        )}
                      </span>
                    </div>
                    {r.error && (
                      <p className="mt-1 font-mono text-xs text-ink-red">{r.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
