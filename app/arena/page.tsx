"use client";

// Arena: pairwise LLM comparisons + Bradley-Terry over applications (see
// ARENA-SPEC.md). Schedules sparse random matchings, judges each pair via
// OpenRouter (configurable concurrency), appends verdicts to InstantDB, and
// refits BT standings live as results stream in. No Airtable writes.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CURATED_MODELS } from "@/lib/review/ai";
import {
  buildSchedule,
  DEFAULT_ARENA_MODEL,
  DEFAULT_ARENA_PROMPT,
  fitBradleyTerry,
  pairKey,
} from "@/lib/review/arena";
import {
  applicationText,
  DECISIONS,
  STATUSES,
  type Applicant,
} from "@/lib/review/fields";
import type { ArenaComparisonRow } from "@/lib/review/instant";
import { prioFmt, StatusBadge } from "@/app/review/ui";

const LS_KEY = "surplus-arena-config-v1";

type Config = {
  model: string;
  customModel: string;
  prompt: string;
  rounds: number; // comparisons per applicant
  concurrency: number;
  statusFilter: string;
  limit: number;
  save: boolean;
};

const DEFAULT_CONFIG: Config = {
  model: DEFAULT_ARENA_MODEL,
  customModel: "",
  prompt: DEFAULT_ARENA_PROMPT,
  rounds: 20,
  concurrency: 25,
  statusFilter: "all",
  limit: 0,
  save: true,
};

type Comparison = Pick<
  ArenaComparisonRow,
  "aId" | "aName" | "bId" | "bName" | "winnerId" | "loserId" | "model" | "cost"
>;

type Probe = {
  promptTokens: number | null;
  completionTokens: number | null;
  cost: number | null;
  seconds: number;
};

type RunState = {
  total: number;
  done: number;
  errors: string[];
  cost: number;
  startedAt: number;
};

type StandingSortKey = "score" | "name" | "record" | "blendedPrio" | "status" | "decision";

const STANDING_COLUMNS: { key: StandingSortKey; label: string; numeric: boolean }[] = [
  { key: "name", label: "Applicant", numeric: false },
  { key: "score", label: "BT score", numeric: true },
  { key: "record", label: "W–L", numeric: true },
  { key: "blendedPrio", label: "Blended", numeric: true },
  { key: "status", label: "Status", numeric: false },
  { key: "decision", label: "Decision", numeric: true }, // desc = best first
];

const DECISION_COLORS: Record<string, string> = {
  Yes: "text-ink-green font-bold",
  "Lean yes": "text-ink-green",
  "Very unsure": "text-ink-dark/70",
  "Lean no": "text-ink-red/70",
  No: "text-ink-red",
};

const money = (n: number) =>
  n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(3)}`;

const minutes = (s: number) =>
  s < 90 ? `${Math.ceil(s)}s` : `${Math.ceil(s / 60)} min`;

export default function ArenaPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [allModels, setAllModels] = useState<{ id: string; name: string }[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [probing, setProbing] = useState(false);
  const [probeError, setProbeError] = useState("");
  const [run, setRun] = useState<RunState | null>(null);
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
    fetch("/api/review/ai/models")
      .then((r) => r.json())
      .then((d) => setAllModels(d.models ?? []));
    fetch("/api/review/arena/comparisons")
      .then((r) => r.json())
      .then((d) => setComparisons(d.comparisons ?? []));
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_KEY, JSON.stringify(config));
  }, [config, loaded]);

  const model = config.model === "custom" ? config.customModel.trim() : config.model;

  const audience = useMemo(() => {
    let list = applicants.filter((a) => applicationText(a).trim());
    if (config.statusFilter === "none") list = list.filter((a) => !a.status);
    else if (config.statusFilter !== "all")
      list = list.filter((a) => a.status === config.statusFilter);
    if (config.limit > 0) list = list.slice(0, config.limit);
    return list;
  }, [applicants, config.statusFilter, config.limit]);

  const byId = useMemo(() => new Map(applicants.map((a) => [a.id, a])), [applicants]);

  // Standings refit from every comparison of the selected model — cheap
  // enough (ms) to recompute on each incoming result.
  const modelComparisons = useMemo(
    () => comparisons.filter((c) => c.model === model),
    [comparisons, model]
  );
  const standings = useMemo(
    () => fitBradleyTerry(modelComparisons),
    [modelComparisons]
  );

  // Standings enriched with Airtable context, plus a stable BT rank so the
  // # column survives re-sorting by other headers.
  const [sort, setSort] = useState<{ key: StandingSortKey; desc: boolean }>({
    key: "score",
    desc: true,
  });
  const rows = useMemo(() => {
    return standings.map((s, i) => {
      const a = byId.get(s.id);
      const fromRow = comparisons.find((c) => c.aId === s.id || c.bId === s.id);
      return {
        ...s,
        rank: i + 1,
        name:
          a?.name ??
          (fromRow?.aId === s.id ? fromRow?.aName : fromRow?.bName) ??
          "(unknown)",
        blendedPrio: a?.blendedPrio ?? null,
        status: a?.status ?? null,
        decision: a?.decision ?? null,
      };
    });
  }, [standings, byId, comparisons]);
  const sortedRows = useMemo(() => {
    const dir = sort.desc ? -1 : 1;
    // Ordinal scales: later status = further along the pipeline; DECISIONS is
    // best→worst, so flip it to make "desc" mean best-first like the others.
    const value = (r: (typeof rows)[number]): number | string => {
      switch (sort.key) {
        case "name":
          return r.name.toLowerCase();
        case "record":
          return r.wins - r.losses;
        case "blendedPrio":
          return r.blendedPrio ?? -Infinity;
        case "status":
          return r.status ? STATUSES.indexOf(r.status) : -Infinity;
        case "decision":
          return r.decision ? DECISIONS.length - DECISIONS.indexOf(r.decision) : -Infinity;
        default:
          return r.score;
      }
    };
    return [...rows].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (av === bv) return a.rank - b.rank; // BT rank as tiebreak
      return dir * (av > bv ? 1 : -1);
    });
  }, [rows, sort]);

  function clickSort(key: StandingSortKey, numeric: boolean) {
    setSort((s) =>
      s.key === key ? { key, desc: !s.desc } : { key, desc: numeric }
    );
  }

  const plannedPairs = config.rounds * Math.floor(audience.length / 2);
  const estCost = probe?.cost != null ? plannedPairs * probe.cost : null;
  const estSeconds =
    probe && config.concurrency > 0
      ? (plannedPairs * probe.seconds) / config.concurrency
      : null;

  // One real (unsaved) comparison between two random audience members:
  // measured tokens + dollar cost + latency, per ARENA-SPEC.md.
  async function estimate() {
    if (!model || audience.length < 2) return;
    setProbing(true);
    setProbeError("");
    try {
      const [a, b] = [...audience].sort(() => Math.random() - 0.5);
      const started = performance.now();
      const res = await fetch("/api/review/arena/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          a: { id: a.id, name: a.name, text: applicationText(a) },
          b: { id: b.id, name: b.name, text: applicationText(b) },
          model,
          prompt: config.prompt,
          save: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setProbe({ ...data.usage, seconds: (performance.now() - started) / 1000 });
    } catch (e) {
      setProbe(null);
      setProbeError(String(e));
    } finally {
      setProbing(false);
    }
  }

  async function start() {
    if (!model || audience.length < 2 || plannedPairs === 0) return;
    cancelled.current = false;
    setRunning(true);

    const seen = new Set(
      modelComparisons.map((c) => pairKey(c.aId || c.winnerId, c.bId || c.loserId))
    );
    const schedule = buildSchedule(
      audience.map((a) => a.id),
      config.rounds,
      seen
    );
    setRun({ total: schedule.length, done: 0, errors: [], cost: 0, startedAt: Date.now() });

    let next = 0;
    async function worker() {
      while (!cancelled.current) {
        const i = next++;
        if (i >= schedule.length) return;
        const [aId, bId] = schedule[i];
        const a = byId.get(aId)!;
        const b = byId.get(bId)!;
        try {
          const res = await fetch("/api/review/arena/compare", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              a: { id: a.id, name: a.name, text: applicationText(a) },
              b: { id: b.id, name: b.name, text: applicationText(b) },
              model,
              prompt: config.prompt,
              save: config.save,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
          setComparisons((prev) => [
            ...prev,
            {
              aId: a.id,
              aName: a.name,
              bId: b.id,
              bName: b.name,
              winnerId: data.winnerId,
              loserId: data.loserId,
              model,
              cost: data.usage?.cost ?? null,
            },
          ]);
          setRun((r) =>
            r && { ...r, done: r.done + 1, cost: r.cost + (data.usage?.cost ?? 0) }
          );
        } catch (e) {
          setRun((r) =>
            r && {
              ...r,
              done: r.done + 1,
              errors: [...r.errors, `${a.name} vs ${b.name}: ${String(e)}`],
            }
          );
        }
      }
    }
    await Promise.all(
      Array.from({ length: Math.max(1, config.concurrency) }, worker)
    );
    setRunning(false);
  }

  const set = (patch: Partial<Config>) => setConfig((c) => ({ ...c, ...patch }));

  return (
    <main className="pt-6">
      <h1 className="font-display text-2xl text-ink-dark">Arena</h1>
      <p className="mt-1 font-mono text-sm text-ink-dark/60">
        Pairwise comparisons + Bradley-Terry. Verdicts append to InstantDB
        {config.save ? "" : " (dry run: writes disabled)"}; standings refit live.
        No Airtable writes.
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

          <div className="mt-4 flex gap-4 font-mono text-sm">
            <label className="flex items-center gap-1.5">
              comparisons/applicant
              <input
                type="number"
                min={1}
                value={config.rounds}
                onChange={(e) => set({ rounds: Math.max(1, Number(e.target.value) || 1) })}
                className="w-14 border-2 border-ink-dark/40 bg-paper px-1 py-0.5"
              />
            </label>
            <label className="flex items-center gap-1.5">
              concurrency
              <input
                type="number"
                min={1}
                max={100}
                value={config.concurrency}
                onChange={(e) =>
                  set({ concurrency: Math.max(1, Number(e.target.value) || 1) })
                }
                className="w-14 border-2 border-ink-dark/40 bg-paper px-1 py-0.5"
              />
            </label>
          </div>

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
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={!config.save}
                onChange={(e) => set({ save: !e.target.checked })}
              />
              dry run (don’t write to Instant)
            </label>
          </div>

          {/* cost estimate */}
          <div className="mt-4 border-2 border-ink-dark/30 bg-paper p-3">
            <div className="flex items-baseline justify-between">
              <span className="font-condensed text-lg tracking-wide">
                {plannedPairs.toLocaleString()} PAIRS PLANNED
              </span>
              <button
                onClick={estimate}
                disabled={probing || !model || audience.length < 2}
                className="font-mono text-xs text-ink-blue underline hover:text-ink-pink disabled:opacity-40"
              >
                {probing ? "probing…" : "estimate cost"}
              </button>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-dark/70">
              {audience.length} applicants × {config.rounds} comparisons ÷ 2
            </p>
            {probe && (
              <p className="mt-2 font-mono text-xs leading-relaxed">
                Probe: {probe.promptTokens?.toLocaleString() ?? "?"} in +{" "}
                {probe.completionTokens?.toLocaleString() ?? "?"} out tokens,{" "}
                {probe.cost != null ? money(probe.cost) : "$?"},{" "}
                {probe.seconds.toFixed(1)}s.
                <br />
                <span className="font-bold text-ink-blue">
                  Run ≈ {estCost != null ? money(estCost) : "$?"} ·{" "}
                  {estSeconds != null ? `~${minutes(estSeconds)}` : "?"} at{" "}
                  {config.concurrency}-way
                </span>
              </p>
            )}
            {probeError && (
              <p className="mt-2 font-mono text-xs text-ink-red">{probeError}</p>
            )}
          </div>

          {!running ? (
            <button
              onClick={start}
              disabled={!model || plannedPairs === 0}
              className="mt-4 w-full border-2 border-ink-dark bg-ink-blue px-3 py-2 font-condensed text-lg tracking-wide text-paper hover:bg-ink-pink disabled:opacity-40"
            >
              RUN {plannedPairs.toLocaleString()} COMPARISONS
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
            Pairs already compared under this model are skipped, so reruns add
            resolution instead of repeating. Try limit 10 + 3 comparisons each
            to sanity-check the prompt first.
          </p>
        </div>

        {/* prompt + progress + standings */}
        <div>
          <details>
            <summary className="cursor-pointer font-mono text-sm">
              Prompt{" "}
              <span className="text-ink-dark/50">
                ({"{{APPLICATION_A}}"} / {"{{APPLICATION_B}}"} replaced per pair)
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  set({ prompt: DEFAULT_ARENA_PROMPT });
                }}
                className="ml-3 font-mono text-xs text-ink-blue underline hover:text-ink-pink"
              >
                reset to default
              </button>
            </summary>
            <textarea
              value={config.prompt}
              onChange={(e) => set({ prompt: e.target.value })}
              rows={14}
              className="mt-1 w-full resize-y border-2 border-ink-dark/40 bg-paper p-2 font-mono text-xs leading-relaxed outline-none focus:border-ink-pink"
            />
          </details>

          {run && (
            <div className="mt-4">
              <div className="flex items-center gap-4 font-mono text-sm">
                <span>
                  {run.done} / {run.total}
                </span>
                <div className="h-2 flex-1 border border-ink-dark/40 bg-paper">
                  <div
                    className="h-full bg-ink-blue"
                    style={{ width: `${(run.done / Math.max(1, run.total)) * 100}%` }}
                  />
                </div>
                <span className="text-ink-dark/60">{money(run.cost)}</span>
                {run.errors.length > 0 && (
                  <span className="text-ink-red">{run.errors.length} errors</span>
                )}
              </div>
              {run.errors.length > 0 && (
                <details className="mt-1 font-mono text-xs text-ink-red">
                  <summary className="cursor-pointer">
                    {run.errors.length} failed comparison
                    {run.errors.length === 1 ? "" : "s"}
                  </summary>
                  {run.errors.slice(-20).map((e, i) => (
                    <p key={i} className="mt-0.5">
                      {e}
                    </p>
                  ))}
                </details>
              )}
            </div>
          )}

          {/* standings */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-condensed text-xl tracking-wide">STANDINGS</h2>
              <span className="font-mono text-xs text-ink-dark/50">
                {modelComparisons.length.toLocaleString()} comparisons · {model || "no model"}
              </span>
            </div>
            {standings.length === 0 ? (
              <p className="mt-2 font-mono text-sm text-ink-dark/50">
                No comparisons stored for this model yet.
              </p>
            ) : (
              <table className="mt-2 w-full border-2 border-ink-dark font-mono text-sm">
                <thead>
                  <tr className="border-b-2 border-ink-dark bg-paper-deep text-left font-condensed text-base tracking-wide">
                    <th className="w-10 px-2 py-1.5">#</th>
                    {STANDING_COLUMNS.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => clickSort(c.key, c.numeric)}
                        className={`cursor-pointer select-none px-2 py-1.5 hover:text-ink-pink ${
                          ["score", "record", "blendedPrio"].includes(c.key)
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {c.label}
                        {sort.key === c.key && (
                          <span className="text-ink-pink">{sort.desc ? " ▾" : " ▴"}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((r) => (
                    <tr key={r.id} className="border-b border-ink-dark/15 last:border-b-0">
                      <td className="px-2 py-1 text-ink-dark/50">{r.rank}</td>
                      <td className="px-2 py-1">
                        <Link
                          href={`/review/app/${r.id}`}
                          className="font-condensed text-base hover:text-ink-pink"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td className="px-2 py-1 text-right font-bold text-ink-blue">
                        {r.score.toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right text-ink-dark/70">
                        {r.wins}–{r.losses}
                      </td>
                      <td className="px-2 py-1 text-right">{prioFmt(r.blendedPrio)}</td>
                      <td className="px-2 py-1">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-2 py-1">
                        {r.decision ? (
                          <span className={DECISION_COLORS[r.decision] ?? ""}>
                            {r.decision}
                          </span>
                        ) : (
                          <span className="text-ink-dark/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
