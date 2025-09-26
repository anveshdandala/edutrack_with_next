"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { AcademicDetailsCard } from "@/components/academic-details-card";
import { ActivityScoreCard } from "@/components/activity-score-card";
import { CarouselSection } from "@/components/carousel-section";
import { motion } from "framer-motion"; // Import motion

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function StudentDashboard() {
  return (
    <div className="min-h-screen mx-[max(7vw,12px)] bg-background">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[15px]">
        <AcademicDetailsCard />
        <ActivityScoreCard />
      </div>
      <CarouselSection />
    </div>
  );
}
