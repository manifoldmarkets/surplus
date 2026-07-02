// Merge-tag rendering for batch emails. Shared by the client preview and the
// server send route so both render identically.
import { APPLICATION_SECTIONS, applicationText, type Applicant } from "@/lib/review/fields";

// Friendly tag name -> value. Every tag is usable as {{Tag Name}}.
export function mergeValues(a: Applicant): Record<string, string> {
  const values: Record<string, string> = {
    Name: a.name,
    "First name": a.name.trim().split(/\s+/)[0] ?? "",
    Email: a.email,
    "Idea (short)": a.ideaShort,
    Status: a.status ?? "",
    ALL_RESPONSES: applicationText(a),
  };
  for (const { label, key } of APPLICATION_SECTIONS) {
    if (key === "link1") {
      values[label] = [a.link1, a.link2, a.link3].filter(Boolean).join("\n");
      continue;
    }
    const v = a[key];
    if (typeof v === "string") values[label] = v;
  }
  return values;
}

export const MERGE_TAGS = [
  "Name",
  "First name",
  "Email",
  "Idea (short)",
  "Status",
  "ALL_RESPONSES",
  ...APPLICATION_SECTIONS.map((s) => s.label).filter(
    (l) => !["Idea (short)"].includes(l)
  ),
];

export function renderTemplate(template: string, a: Applicant): string {
  const values = mergeValues(a);
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, tag: string) =>
    tag in values ? values[tag] : match
  );
}
