import PortfolioClientWrapper from "./PortfolioClientWrapper";
import { serverFetch } from "@/lib/server-api";
import { headers } from "next/headers";
import StudentShell from "@/components/student/StudentShell";

export default async function ProfessionalPortfolioPage({ params }) {
  const headerList = await headers();
  const tenant = headerList.get("x-tenant");
  const user = await serverFetch("/auth/users/me/", { tenant });

  if (!user || !user.id) {
    return <div>Error loading user profile.</div>;
  }

  const studentDetails = await serverFetch("/resume/student/data/ ", { 
    tenant,
    cache: "no-store" 
  });

  const fullProfile = {
    ...user,          
    ...studentDetails 
  };

  return (
    <StudentShell user={user}>
      <PortfolioClientWrapper user={fullProfile} />
    </StudentShell>
  );
}
