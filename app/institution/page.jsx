"use client";
import { KPICards } from "@/components/institution/KPICards";
import { CompetencyChart } from "@/components/institution/CompetencyChart";
import { QuickActions } from "@/components/institution/QuickActions";
import { AchievementTrends } from "@/components/institution/AchievementTrends";
import { AchievementBreakdown } from "@/components/institution/AchievementBreakdown";
import { RecentAchievements } from "@/components/institution/RecentAchievements";
// lazy chart component (client only)

export default function InstitutionPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Institution Dashboard</h1>
        <p className="text-muted">Admin actions and insights</p>
      </header>

      <KPICards />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <CompetencyChart />
        <QuickActions />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AchievementTrends />
        <AchievementBreakdown />
      </div>

      {/* Recent Achievements */}
      <RecentAchievements />
    </div>
  );
}
