// components/common/GlobalLoginClient.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CollegeCard from "@/components/common/CollegeCard";

export default function GlobalLoginClient({ colleges }) {
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  const selectTenant = async (college) => {
    setLoadingId(college.id);
    try {
      const res = await fetch("/api/select-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: college.schema_name,
          name: college.name,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to select tenant");
      }

      router.push(`/${college.schema_name}/auth/login`);
    } catch (err) {
      console.error("selectTenant error:", err);
      alert("Failed to select tenant");
    } finally {
      setLoadingId(null);
    }
  };

  if (!colleges || colleges.length === 0) {
    return <div className="p-10">No colleges found.</div>;
  }

  return (
    <div className="p-10">
      <div className="grid gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
            onSelect={() => selectTenant(college)}
            disabled={loadingId === college.id}
          />
        ))}
      </div>
    </div>
  );
}
