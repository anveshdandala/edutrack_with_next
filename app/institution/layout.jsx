"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/useAuth";
import Sidebar from "@/components/institution/Sidebar";

export default function InstitutionLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking auth…
      </div>
    );
  if (!user) return null; // redirected

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
