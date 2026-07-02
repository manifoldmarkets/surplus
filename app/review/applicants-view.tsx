"use client";

// List + kanban views over all applicants. Sorting/filtering happens
// client-side (~150 records). State lives in the URL where cheap so views
// survive refresh/back.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  STATUSES,
  type Applicant,
  type Status,
} from "@/lib/review/fields";
import { prioFmt, StarRating, StatusBadge, StatusSelect, timeAgo } from "@/app/review/ui";

type SortKey =
  | "created"
  | "name"
  | "austinPrio"
  | "carolPrio"
  | "opusPrio"
  | "gptPrio"
  | "blendedPrio";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "created", label: "Newest" },
  { key: "blendedPrio", label: "Blended prio" },
  { key: "austinPrio", label: "Austin prio" },
  { key: "carolPrio", label: "Carol prio" },
  { key: "opusPrio", label: "Opus prio" },
  { key: "gptPrio", label: "GPT prio" },
  { key: "name", label: "Name" },
];

export function ApplicantsView({ initial }: { initial: Applicant[] }) {
  const router = useRouter();
  const [applicants, setApplicants] = useState(initial);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("blendedPrio");
  const [desc, setDesc] = useState(true);

  function onSaved(updated: Applicant) {
    setApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = applicants;
    if (q) {
      list = list.filter((a) =>
        [a.name, a.email, a.ideaShort, a.mainIdea, a.austinNotes]
          .join("\n")
          .toLowerCase()
          .includes(q)
      );
    }
    if (statusFilter === "none") list = list.filter((a) => !a.status);
    else if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (categoryFilter !== "all")
      list = list.filter((a) => a.category.includes(categoryFilter));

    const dir = desc ? -1 : 1;
    return [...list].sort((a, b) => {
      if (sort === "name") return dir * a.name.localeCompare(b.name);
      if (sort === "created")
        return dir * a.createdTime.localeCompare(b.createdTime);
      const av = a[sort] ?? -Infinity;
      const bv = b[sort] ?? -Infinity;
      return av === bv ? a.name.localeCompare(b.name) : dir * (av > bv ? 1 : -1);
    });
  }, [applicants, search, statusFilter, categoryFilter, sort, desc]);

  const open = (id: string) => router.push(`/review/app/${id}`);

  return (
    <main className="pt-6">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, idea, notes…"
          className="w-64 border-2 border-ink-dark/40 bg-paper px-3 py-1.5 font-mono text-sm outline-none focus:border-ink-pink"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
        >
          <option value="all">All statuses</option>
          <option value="none">No status</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border-2 border-ink-dark/40 bg-paper px-2 py-1.5 font-mono text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              Sort: {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setDesc(!desc)}
          className="border-2 border-ink-dark/40 px-2 py-1.5 font-mono text-sm hover:border-ink-pink"
          title="Flip sort direction"
        >
          {desc ? "↓" : "↑"}
        </button>
        <span className="font-mono text-sm text-ink-dark/60">
          {filtered.length} / {applicants.length}
        </span>
        <div className="ml-auto flex font-condensed text-base">
          {(["list", "kanban"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`border-2 border-ink-dark px-3 py-1 uppercase tracking-wide ${
                view === v ? "bg-ink-dark text-paper" : "hover:bg-ink-dark/10"
              } ${v === "kanban" ? "border-l-0" : ""}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <ListTable rows={filtered} onOpen={open} onSaved={onSaved} />
      ) : (
        <Kanban rows={filtered} onOpen={open} onSaved={onSaved} />
      )}
    </main>
  );
}

function ListTable({
  rows,
  onOpen,
  onSaved,
}: {
  rows: Applicant[];
  onOpen: (id: string) => void;
  onSaved: (a: Applicant) => void;
}) {
  return (
    <div className="mt-4 overflow-x-auto border-2 border-ink-dark">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink-dark bg-paper-deep text-left font-condensed text-base tracking-wide">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Idea</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Austin</th>
            <th className="px-3 py-2 text-right">Carol</th>
            <th className="px-3 py-2 text-right">Opus</th>
            <th className="px-3 py-2 text-right">GPT</th>
            <th className="px-3 py-2 text-right">Blend</th>
            <th className="px-3 py-2 text-right">Applied</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr
              key={a.id}
              onClick={() => onOpen(a.id)}
              className="cursor-pointer border-b border-ink-dark/15 align-top hover:bg-ink-yellow/20"
            >
              <td className="px-3 py-2 font-condensed text-base whitespace-nowrap">
                {a.name || "(no name)"}
                {a.cofounderNames.length > 0 && (
                  <span className="ml-1 text-ink-dark/50" title={`Cofounder: ${a.cofounderNames.join(", ")}`}>
                    +{a.cofounderNames.length}
                  </span>
                )}
                {a.austinNotes && (
                  <span className="ml-1 text-ink-blue" title="Has Austin notes">✎</span>
                )}
              </td>
              <td className="max-w-[340px] px-3 py-2 text-ink-dark/80">
                <div className="line-clamp-2">{a.ideaShort}</div>
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-3 py-2">
                <StarRating applicant={a} onSaved={onSaved} />
              </td>
              <td className="px-3 py-2 text-right font-mono">{prioFmt(a.carolPrio)}</td>
              <td className="px-3 py-2 text-right font-mono">{prioFmt(a.opusPrio)}</td>
              <td className="px-3 py-2 text-right font-mono">{prioFmt(a.gptPrio)}</td>
              <td className="px-3 py-2 text-right font-mono font-bold text-ink-blue">
                {prioFmt(a.blendedPrio)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs whitespace-nowrap text-ink-dark/60">
                {timeAgo(a.createdTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-6 text-center font-mono text-sm text-ink-dark/50">
          No applicants match.
        </p>
      )}
    </div>
  );
}

const KANBAN_COLUMNS: (Status | "No status")[] = ["No status", ...STATUSES];

function Kanban({
  rows,
  onOpen,
  onSaved,
}: {
  rows: Applicant[];
  onOpen: (id: string) => void;
  onSaved: (a: Applicant) => void;
}) {
  return (
    <div className="mt-4 flex gap-3 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const cards = rows.filter((a) =>
          col === "No status" ? !a.status : a.status === col
        );
        if (col === "No status" && cards.length === 0) return null;
        return (
          <div key={col} className="w-64 shrink-0">
            <div className="flex items-baseline justify-between border-b-2 border-ink-dark pb-1">
              <h3 className="font-condensed text-base tracking-wide">{col}</h3>
              <span className="font-mono text-xs text-ink-dark/60">{cards.length}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {cards.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onOpen(a.id)}
                  className="cursor-pointer border-2 border-ink-dark/60 bg-paper-deep p-2 hover:border-ink-pink"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-condensed text-base leading-tight">
                      {a.name || "(no name)"}
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-blue">
                      {prioFmt(a.blendedPrio)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-dark/70">
                    {a.ideaShort}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <StarRating applicant={a} onSaved={onSaved} />
                  </div>
                  <div className="mt-1">
                    <StatusSelect applicant={a} onSaved={onSaved} className="w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
