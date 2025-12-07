import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-api";
import StudentProfileClient from "./profile-client";

export default async function StudentProfilePage({ params }) {
  const { tenant } = await params;
  let user = null;

  try {
    // Enable server-side fetching with tenant context
    user = await serverFetch("/auth/users/me/", { tenant });
    // console.log("[profile] user found:", user?.username);
  } catch (e) {
    console.error("Failed to fetch user profile:", e.message);
    // If unauthorized or fail, redirect to login
    redirect(`/${tenant}/auth/login`);
  }

  if (!user) {
      redirect(`/${tenant}/auth/login`); 
  }

  return <StudentProfileClient user={user} />;
}
