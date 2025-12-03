import { MonthlyProgressChart } from "@/components/vercel/monthly-progress-chart";
import { StrengthsImprovementsCard } from "@/components/vercel/strengths-improvements-card";
import { FocusAreasCard } from "@/components/vercel/focus-areas-card";
import { PeerComparisonCard } from "@/components/vercel/peer-comparison-card";
import { SkillMasteryCard } from "@/components/vercel/skill-mastery-card";
import { Calendar, User, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/student/dashboard-header";
export default function MonthlyReportPage() {
  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background gradient - Soft and clean for a bright theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />

        {/* Subtle grid pattern - Darker with low opacity to be visible on a light background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {/* Changed accent colors for better contrast */}
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              {/* Changed text colors from light to dark for readability */}
              <h1 className="text-3xl font-bold text-slate-800">
                Monthly Progress Report
              </h1>
            </div>
            <p className="text-slate-600">
              Personal portfolio analysis for self-improvement
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Student Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>December 2024</span>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="mb-8">
            <MonthlyProgressChart />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StrengthsImprovementsCard />
            <FocusAreasCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PeerComparisonCard />
            <SkillMasteryCard />
          </div>
        </div>
      </div>{" "}
    </>
  );
}
