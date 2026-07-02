import { listApplicants } from "@/lib/review/airtable";
import { ApplicantsView } from "@/app/review/applicants-view";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const applicants = await listApplicants();
  return <ApplicantsView initial={applicants} />;
}
