// app/institution/layout.jsx
import { fetchServer } from "@/lib/server-api"; // Your new server fetcher
import { redirect } from "next/navigation";
import Sidebar from "@/components/institution/Sidebar"; // Your Client Sidebar

export default async function InstitutionLayout({ children }) {
  // 1. Fetch User Server-Side
  // This runs on the server. If no cookie, it returns null or throws.
  let user = null;
  try {
    user = await fetchServer("/auth/users/me/");
  } catch (error) {
    // If API fails (401), user is null
  }

  // 2. Server-Side Protection
  // If no user, kick them out before rendering HTML
  if (!user) {
    redirect("/login");
  }

  // 3. Optional: Role Check
  // Ensure only "ADMIN" or "INSTITUTION" can see this layout
  const role = (user.role || user.user_type || "").toUpperCase();
  if (role !== "ADMIN" && role !== "INSTITUTION") {
    // redirect("/unauthorized"); // or back to login
  }
  console.log("[inst layout] user :", user);

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* Pass the server-fetched user to the Sidebar */}
        <Sidebar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
