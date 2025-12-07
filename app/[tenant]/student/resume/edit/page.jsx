import { serverFetch } from "@/lib/server-api";
import ResumeEditorClient from "./resume-editor-client";
import { redirect } from "next/navigation";

export default async function ResumeEditorPage({ params }) {
  const { tenant } = await params;

  // Fetch base profile in case user refreshes or comes here directly
  const userData = await serverFetch("/auth/users/me/", { tenant });
  
  if (!userData) {
    redirect(`/${tenant}/auth/login`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ResumeEditorClient tenant={tenant} baseData={userData} />
    </main>
  );
}
