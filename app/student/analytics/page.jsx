import { MonthlyProgressChart } from "@/components/vercel/monthly-progress-chart";
import { StrengthsImprovementsCard } from "@/components/vercel/strengths-improvements-card";
import { FocusAreasCard } from "@/components/vercel/focus-areas-card";
import { PeerComparisonCard } from "@/components/vercel/peer-comparison-card";
import { SkillMasteryCard } from "@/components/vercel/skill-mastery-card";
import { Calendar, User, TrendingUp } from "lucide-react";
import StudentShell from "@/components/student/StudentShell";

export default function MonthlyReportPage() {
  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Calendar className="size-5" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold">Monthly Progress Report</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Personal portfolio analysis for self-improvement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
              <User className="size-4" />
              <span>Student Dashboard</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
              <TrendingUp className="size-4" />
              <span>December 2024</span>
            </div>
          </div>
        </div>

        <MonthlyProgressChart />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StrengthsImprovementsCard />
          <FocusAreasCard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PeerComparisonCard />
          <SkillMasteryCard />
        </div>
      </div>
    </StudentShell>
  );
}
