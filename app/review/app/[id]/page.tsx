import { notFound } from "next/navigation";
import { listApplicants } from "@/lib/review/airtable";
import { ApplicantDetail } from "@/app/review/app/[id]/detail";

export const dynamic = "force-dynamic";

export default async function ApplicantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch the full list so prev/next navigation follows blended-prio order.
  const all = await listApplicants();
  const sorted = [...all].sort(
    (a, b) => (b.blendedPrio ?? -1) - (a.blendedPrio ?? -1)
  );
  const index = sorted.findIndex((a) => a.id === id);
  if (index === -1) notFound();

  return (
    <ApplicantDetail
      initial={sorted[index]}
      prevId={index > 0 ? sorted[index - 1].id : null}
      nextId={index < sorted.length - 1 ? sorted[index + 1].id : null}
      position={`${index + 1} / ${sorted.length}`}
    />
  );
}
