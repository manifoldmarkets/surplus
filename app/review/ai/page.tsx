"use client";

// AI review pipeline: pick a model + prompt + audience, run grading over
// applicants (3 concurrent), results stream into the table and are written
// to Airtable as "<label> prio" / "<label> notes". Config persists to
// localStorage so prompt iterations survive reloads.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CURATED_MODELS,
  DEFAULT_LABEL,
  DEFAULT_MODEL,
  DEFAULT_PROMPT,
} from "@/lib/review/ai";
import { STATUSES, type Applicant } from "@/lib/review/fields";

const LS_KEY = "surplus-ai-config-v1";
const CONCURRENCY = 3;

type RunResult = {
  recordId: string;
  name: string;
  status: "pending" | "running" | "done" | "error";
  score?: number | null;
  reasoning?: string;
  error?: string;
};

type Config = {
  model: string;
  customModel: string;
  label: string;
  prompt: string;
  statusFilter: string;
  skipGraded: boolean;
  limit: number;
  write: boolean;
};

const DEFAULT_CONFIG: Config = {
  model: DEFAULT_MODEL,
  customModel: "",
  label: DEFAULT_LABEL,
  prompt: DEFAULT_PROMPT,
  statusFilter: "all",
  skipGraded: true,
  limit: 0,
  write: true,
};

export default function AiReviewPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [allModels, setAllModels] = useState<{ id: string; name: string }[]>([]);
  const [graded, setGraded] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState(false);
  const cancelled = useRef(false);

  // load config + applicants + graded set
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
    fetch("/api/review/applicants")
      .then((r) => r.json())
      .then((d) => setApplicants(d.applicants ?? []));
    fetch("/api/review/ai/models")
      .then((r) => r.json())
      .then((d) => setAllModels(d.models ?? []));
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_KEY, JSON.stringify(config));
  }, [config, loaded]);

  const label = config.label.trim() || DEFAULT_LABEL;

  useEffect(() => {
    if (!config.skipGraded) return;
    fetch(`/api/review/ai/graded?label=${encodeURIComponent(label)}`)
      .then((r) => r.json())
      .then((d) => setGraded(new Set(d.graded ?? [])));
  }, [label, config.skipGraded]);

  const model = config.model === "custom" ? config.customModel.trim() : config.model;

  const audience = useMemo(() => {
    let list = applicants;
    if (config.statusFilter === "none") list = list.filter((a) => !a.status);
    else if (config.statusFilter !== "all")
      list = list.filter((a) => a.status === config.statusFilter);
    if (config.skipGraded) list = list.filter((a) => !graded.has(a.id));
    if (config.limit > 0) list = list.slice(0, config.limit);
    return list;
  }, [applicants, config.statusFilter, config.skipGraded, config.limit, graded]);

  async function run() {
    if (!model || audience.length === 0) return;
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
          const res = await fetch("/api/review/ai/grade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recordId: item.recordId,
              model,
              prompt: config.prompt,
              label,
              write: config.write,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
          update(item.recordId, {
            status: "done",
            score: data.score,
            reasoning: data.reasoning,
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
    // refresh graded set so a rerun skips what just finished
    if (config.skipGraded) {
      fetch(`/api/review/ai/graded?label=${encodeURIComponent(label)}`)
        .then((r) => r.json())
        .then((d) => setGraded(new Set(d.graded ?? [])));
    }
  }

  const doneCount = results.filter((r) => r.status === "done").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const set = (patch: Partial<Config>) => setConfig((c) => ({ ...c, ...patch }));

  return (
    <main className="pt-6">
      <h1 className="font-display text-2xl text-ink-dark">AI Review</h1>
      <p className="mt-1 font-mono text-sm text-ink-dark/60">
        Grades applicants via OpenRouter and writes “{label} prio” + “{label}{" "}
        notes” to Airtable{config.write ? "" : " (dry run: writes disabled)"}.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* config panel */}
        <div className="h-fit border-2 border-ink-dark bg-paper-deep p-4">
          <label className="font-mono text-sm">Model</label>
          <select
            value={config.model}
            onChange={(e) => set({ model: e.target.value })}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          >
            {CURATED_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.note}
              </option>
            ))}
            <option value="custom">custom (any OpenRouter model)…</option>
          </select>
          {config.model === "custom" && (
            <>
              <input
                list="all-models"
                value={config.customModel}
                onChange={(e) => set({ customModel: e.target.value })}
                placeholder="e.g. z-ai/glm-5"
                className="mt-2 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
              />
              <datalist id="all-models">
                {allModels.map((m) => (
                  <option key={m.id} value={m.id} />
                ))}
              </datalist>
            </>
          )}

          <label className="mt-4 block font-mono text-sm">
            Run label{" "}
            <span className="text-ink-dark/50">→ “{label} prio” / “{label} notes” fields</span>
          </label>
          <input
            value={config.label}
            onChange={(e) => set({ label: e.target.value })}
            className="mt-1 w-full border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
          />

          <label className="mt-4 block font-mono text-sm">Audience</label>
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
                checked={config.skipGraded}
                onChange={(e) => set({ skipGraded: e.target.checked })}
              />
              skip already graded
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
            dry run (don’t write to Airtable)
          </label>

          {!running ? (
            <button
              onClick={run}
              disabled={!model || audience.length === 0}
              className="mt-4 w-full border-2 border-ink-dark bg-ink-blue px-3 py-2 font-condensed text-lg tracking-wide text-paper hover:bg-ink-pink disabled:opacity-40"
            >
              GRADE {audience.length} APPLICANT{audience.length === 1 ? "" : "S"}
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
            Try “limit 3” + a cheap model first to sanity-check the prompt.
          </p>
        </div>

        {/* prompt + results */}
        <div>
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-sm">
              Prompt <span className="text-ink-dark/50">({"{{APPLICATION}}"} is replaced per applicant)</span>
            </label>
            <button
              onClick={() => set({ prompt: DEFAULT_PROMPT })}
              className="font-mono text-xs text-ink-blue underline hover:text-ink-pink"
            >
              reset to default
            </button>
          </div>
          <textarea
            value={config.prompt}
            onChange={(e) => set({ prompt: e.target.value })}
            rows={12}
            className="mt-1 w-full resize-y border-2 border-ink-dark/40 bg-paper p-2 font-mono text-xs leading-relaxed outline-none focus:border-ink-pink"
          />

          {results.length > 0 && (
            <>
              <div className="mt-4 flex items-center gap-4 font-mono text-sm">
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
                      <span className="ml-auto font-mono text-sm">
                        {r.status === "pending" && <span className="text-ink-dark/40">queued</span>}
                        {r.status === "running" && <span className="text-ink-blue">grading…</span>}
                        {r.status === "error" && <span className="text-ink-red">error</span>}
                        {r.status === "done" && (
                          <span className="font-bold text-ink-blue">
                            [{r.score ?? "?"}]
                          </span>
                        )}
                      </span>
                    </div>
                    {r.reasoning && (
                      <p className="mt-1 text-sm leading-snug text-ink-dark/80">
                        {r.reasoning}
                      </p>
                    )}
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
