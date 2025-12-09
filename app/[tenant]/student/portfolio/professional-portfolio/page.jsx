import PortfolioClientWrapper from "./PortfolioClientWrapper";
import { serverFetch } from "@/lib/server-api";

export default async function ProfessionalPortfolioPage({ params }) {
  const { tenant } = await params;

  // 1. Fetch Basic User Info (to get ID)
  const user = await serverFetch("/auth/users/me/", { tenant });

  if (!user || !user.id) {
    // Handle error or redirect
    return <div>Error loading user profile.</div>;
  }

  // 2. Fetch Detailed Student Data
  // Endpoint: GET /api/{tenant}/administration/student-details/{id}/
  const studentDetails = await serverFetch(`/administration/student-details/${user.id}`, { 
    tenant,
    cache: "no-store" 
  });

  // 3. Merge Data (Optional, but useful to have one object)
  const fullProfile = {
    ...user,          // Basic auth info (username, role)
    ...studentDetails // Detailed info (skills, education, phone, etc.)
  };

  return <PortfolioClientWrapper user={fullProfile} />;
}