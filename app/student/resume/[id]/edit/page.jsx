import { serverFetch } from "@/lib/server-api";
import ResumeEditorClient from "./ResumeEditorClient";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import StudentShell from "@/components/student/StudentShell";

export default async function ResumeEditorPage({ params }) {
const headerList = await headers();
  const tenant = headerList.get("x-tenant");
  const { id } = await params;
  // Fetch base profile in case user refreshes or comes here directly
  const userData = await serverFetch("/auth/users/me/", { tenant });
  
  if (!userData) {
    redirect(`/auth/login`);
  }
  const resumeData = await serverFetch(`/resume/resume/${id}/`);


  return (
    <StudentShell user={userData}>
      <ResumeEditorClient resumeId={id} tenant={tenant} resumeData={resumeData} baseData={userData} />
    </StudentShell>
  );
}
