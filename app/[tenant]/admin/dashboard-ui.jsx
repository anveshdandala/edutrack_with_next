"use client";
import { KPICards } from "@/components/institution/KPICards";
import { CompetencyChart } from "@/components/institution/CompetencyChart";
// ... other imports

export default function InstitutionDashboardUI({ user }) {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Institution Dashboard</h1>
        <p className="text">Welcome back, {user?.username}</p>
      </header>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <CompetencyChart />
        {/* ... rest of your components ... */}
      </div>
    </div>
  );
}
