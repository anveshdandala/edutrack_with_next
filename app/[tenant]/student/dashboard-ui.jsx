"use client";

import { motion } from "framer-motion";
import { MOCK_STUDENT_PROFILE } from "@/components/student/constants";
import { DashboardHeader } from "@/components/student/dashboard-header";
import { AcademicDetailsCard } from "@/components/student/academic-details-card";
import { ActivityScoreCard } from "@/components/student/activity-score-card";
import { CarouselSection } from "@/components/student/carousel-section";
import { ChatInterface } from "@/components/student/chat-interface";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function StudentDashboardUI({ user }) {
  const userName = user?.username || "Student";

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <DashboardHeader user={user} />
      <motion.main className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className="h-full">
            <AcademicDetailsCard />
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <ActivityScoreCard />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <CarouselSection />
        </motion.div>
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <ChatInterface studentProfile={MOCK_STUDENT_PROFILE} />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
