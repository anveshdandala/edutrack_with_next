import JobInputForm from "@/components/resume/JobInputForm";
import { headers } from "next/headers";
import StudentShell from "@/components/student/StudentShell";

export default async function ResumePage({ params }) {

    const headerList = await headers();
    const tenant = headerList.get("x-tenant");

  return (
    <StudentShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Resume</h1>
          <p className="text-sm text-muted-foreground">
            Generate an ATS-friendly resume from your student profile and target role.
          </p>
        </div>
        <div className="rounded-md border bg-card p-5">
          <JobInputForm tenant={tenant} />
        </div>
      </div>
    </StudentShell>
  );
}
