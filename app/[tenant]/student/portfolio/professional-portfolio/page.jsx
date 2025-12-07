// Server Component
import PortfolioClientWrapper from "./PortfolioClientWrapper";
import { serverFetch } from "@/lib/server-api";
export default async function ProfessionalPortfolioPage({params}) {
  const { tenant } = await params;

  const user = await serverFetch("/auth/users/me/", { tenant });


  return <PortfolioClientWrapper user={user} />;
}
