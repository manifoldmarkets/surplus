"use client";

// Applicant detail: quick skim at the top (short idea, ratings), the long
// application in reading order, everything else behind <details>. A sticky
// review panel edits Austin's notes / prio / status, saving to Airtable.

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type Applicant } from "@/lib/review/fields";
import { patchApplicant, prioFmt, StarRating, StatusSelect } from "@/app/review/ui";

export function ApplicantDetail({
  initial,
  prevId,
  nextId,
  position,
}: {
  initial: Applicant;
  prevId: string | null;
  nextId: string | null;
  position: string;
}) {
  const router = useRouter();
  const [a, setA] = useState(initial);
  const onSaved = (updated: Applicant) => setA(updated);

  // j/k keyboard navigation (skipped while typing).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.tagName === "SELECT") return;
      if (e.key === "j" && nextId) router.push(`/review/app/${nextId}`);
      if (e.key === "k" && prevId) router.push(`/review/app/${prevId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevId, nextId]);

  const links = [a.ideaLink, a.link1, a.link2, a.link3].filter(Boolean);

  return (
    <main className="pt-6">
      {/* top bar: back + prev/next */}
      <div className="flex items-center gap-3 font-mono text-sm">
        <Link href="/review" className="text-ink-blue underline hover:text-ink-pink">
          ← all applications
        </Link>
        <span className="ml-auto text-ink-dark/50">{position} by blended prio</span>
        <NavButton id={prevId} label="← prev (k)" />
        <NavButton id={nextId} label="next (j) →" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* left: the application */}
        <div>
          <h1 className="font-display text-3xl leading-tight text-ink-dark">
            {a.name || "(no name)"}
          </h1>
          <p className="mt-2 font-serif text-xl italic text-ink-blue">
            {a.ideaShort}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm text-ink-dark/70">
            <a href={`mailto:${a.email}`} className="underline">{a.email}</a>
            {a.location && <span>{a.location}</span>}
            <span>applied {new Date(a.createdTime).toLocaleDateString()}</span>
            {a.category.map((c) => (
              <span key={c} className="bg-ink-blue/15 px-1.5 py-0.5 text-xs text-ink-blue">
                {c}
              </span>
            ))}
          </div>
          {(links.length > 0 || a.cofounderNames.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
              {links.map((l) => (
                <a
                  key={l}
                  href={l.startsWith("http") ? l : `https://${l}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-pink underline"
                >
                  {l.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              ))}
              {a.cofounderNames.length > 0 && (
                <span className="text-ink-dark/70">
                  cofounder: {a.cofounderNames.join(", ")}
                </span>
              )}
            </div>
          )}

          {/* main reading flow */}
          <Section title="The idea" body={a.mainIdea} open />
          <Section title="Why this idea" body={a.reasonForIdea} open />
          <Section title="Most impactful project" body={a.mostImpactful} open />
          <Section title="Users & acquisition" body={a.usersAcquisition} />
          <Section title="Revenue model" body={a.revenueModel} />
          <Section title="Other idea interests" body={a.otherInterests} />
          <Section title="Cofounders" body={a.cofounders} />
          <Section
            title="Logistics"
            body={[
              a.entityFormed && `Legal entity formed: ${a.entityFormed}`,
              a.entityDetails && `Entity/equity: ${a.entityDetails}`,
              a.takenFunding && `Taken funding: ${a.takenFunding}`,
              a.fundingDetails && `Funding details: ${a.fundingDetails}`,
            ]
              .filter(Boolean)
              .join("\n\n")}
          />
          <Section title="Claude Fable activity" body={a.claudeActivity} />
          <Section
            title="Misc"
            body={[
              a.referralSource && `Referral source: ${a.referralSource}`,
              a.recommends && `Recommends: ${a.recommends}`,
              a.applicationFeedback && `Application feedback: ${a.applicationFeedback}`,
              a.otherNotes && `Other notes: ${a.otherNotes}`,
            ]
              .filter(Boolean)
              .join("\n\n")}
          />
        </div>

        {/* right: review panel */}
        <aside className="lg:sticky lg:top-16 h-fit border-2 border-ink-dark bg-paper-deep p-4">
          <h2 className="font-condensed text-lg tracking-wide">REVIEW</h2>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-sm">Austin prio</span>
            <StarRating applicant={a} onSaved={onSaved} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-mono text-sm">Status</span>
            <StatusSelect applicant={a} onSaved={onSaved} />
          </div>

          <NotesEditor
            key={`${a.id}-notes`}
            applicant={a}
            field="austinNotes"
            label="Austin notes"
            onSaved={onSaved}
          />
          <NotesEditor
            key={`${a.id}-post`}
            applicant={a}
            field="austinPostInterviewNotes"
            label="Post-interview notes"
            onSaved={onSaved}
          />

          <div className="mt-4 border-t border-ink-dark/20 pt-3 font-mono text-sm">
            <h3 className="font-condensed text-base tracking-wide">OTHER RATINGS</h3>
            <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
              <span className="text-ink-dark/60">Carol prio</span>
              <span className="text-right">{prioFmt(a.carolPrio)}</span>
              <span className="text-ink-dark/60">Opus 4.8 prio</span>
              <span className="text-right">{prioFmt(a.opusPrio)}</span>
              <span className="text-ink-dark/60">GPT-5.4 prio</span>
              <span className="text-right">{prioFmt(a.gptPrio)}</span>
              <span className="text-ink-dark/60">Blended</span>
              <span className="text-right font-bold text-ink-blue">{prioFmt(a.blendedPrio)}</span>
            </div>
            {a.carolNotes && (
              <ReadonlyNotes label="Carol notes" body={a.carolNotes} />
            )}
            {a.opusNotes && (
              <ReadonlyNotes label="Opus 4.8 notes" body={a.opusNotes} />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function NavButton({ id, label }: { id: string | null; label: string }) {
  if (!id)
    return <span className="px-2 py-1 text-ink-dark/30">{label}</span>;
  return (
    <Link
      href={`/review/app/${id}`}
      className="border-2 border-ink-dark px-2 py-1 hover:bg-ink-dark hover:text-paper"
    >
      {label}
    </Link>
  );
}

function Section({
  title,
  body,
  open = false,
}: {
  title: string;
  body: string;
  open?: boolean;
}) {
  if (!body?.trim()) return null;
  return (
    <details open={open} className="group mt-5 border-t-2 border-ink-dark/20 pt-3">
      <summary className="cursor-pointer select-none font-condensed text-lg tracking-wide text-ink-dark marker:text-ink-pink">
        {title}
      </summary>
      <p className="mt-2 whitespace-pre-wrap font-serif text-[17px] leading-relaxed text-ink-dark/90">
        {body.trim()}
      </p>
    </details>
  );
}

function ReadonlyNotes({ label, body }: { label: string; body: string }) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-ink-dark/60">{label}</summary>
      <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed">{body}</p>
    </details>
  );
}

// Autosaving textarea: saves 800ms after you stop typing, and on blur.
function NotesEditor({
  applicant,
  field,
  label,
  onSaved,
}: {
  applicant: Applicant;
  field: "austinNotes" | "austinPostInterviewNotes";
  label: string;
  onSaved: (a: Applicant) => void;
}) {
  const [value, setValue] = useState(applicant[field]);
  const [state, setState] = useState<"idle" | "dirty" | "saving" | "saved" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(value);
  latest.current = value;

  const save = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    setState("saving");
    try {
      const updated = await patchApplicant(applicant.id, { [field]: latest.current });
      onSaved({ ...updated, [field]: latest.current });
      setState("saved");
    } catch {
      setState("error");
    }
  }, [applicant.id, field, onSaved]);

  function onChange(next: string) {
    setValue(next);
    setState("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 800);
  }

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <label className="font-mono text-sm">{label}</label>
        <span
          className={`font-mono text-xs ${
            state === "error" ? "text-ink-red" : "text-ink-dark/50"
          }`}
        >
          {state === "dirty" && "…"}
          {state === "saving" && "saving…"}
          {state === "saved" && "saved ✓"}
          {state === "error" && "save failed — retrying on blur"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => state !== "idle" && state !== "saved" && save()}
        rows={field === "austinNotes" ? 7 : 4}
        placeholder="Write notes… (autosaves)"
        className="mt-1 w-full resize-y border-2 border-ink-dark/40 bg-paper p-2 font-serif text-[15px] leading-snug outline-none focus:border-ink-pink"
      />
    </div>
  );
}
