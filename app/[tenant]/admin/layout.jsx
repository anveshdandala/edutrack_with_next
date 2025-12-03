import { serverFetch } from "@/lib/server-api";
import { redirect } from "next/navigation";
import Sidebar from "@/components/institution/Sidebar";
// REMOVE: import { AuthProvider } from "@/components/AuthProvider";

export default async function InstitutionLayout({ children, params }) {
  const { tenant } = await params;

  // 1. Fetch User (Next.js deduplicates this request automatically)
  let user = null;
  try {
    user = await serverFetch("/auth/users/me/", {
      tenant,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Layout fetch failed:", error.message);
  }

  // 2. SECURE GUARD: Redirect if not logged in
  if (!user) {
    redirect("/globalLogin");
  }

  // 3. Role Guard
  const role = (user?.role || user?.user_type || "").toUpperCase();
  if (role !== "ADMIN" && role !== "INSTITUTION") {
    if (role === "STUDENT") redirect(`/${tenant}/student`);
    else redirect("/globalLogin");
  }

  console.log("dasboard tenant", tenant);

  // 4. Render (No need for AuthProvider here, parent has it)
  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* Pass user prop explicitly to Sidebar */}
        <Sidebar user={user} tenant={tenant} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
