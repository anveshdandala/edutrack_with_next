"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { AcademicDetailsCard } from "@/components/academic-details-card";
import { ActivityScoreCard } from "@/components/activity-score-card";
import { CarouselSection } from "@/components/carousel-section";
import { motion } from "framer-motion";
import useAuth from "@/components/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log("[student page] user:", user);

  // don't access user.role before user is available
  useEffect(() => {
    if (loading) return; // still restoring session
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role && user.role !== "STUDENT") {
      console.warn("unauthorized role for student dashboard:", user.role);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Safe user name fallback
  const userName = user?.username || "Student";

  // show spinner/placeholder while auth is restoring
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <DashboardHeader user={user} />

      <motion.main
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your academic progress today.
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants} className="h-full">
            <AcademicDetailsCard />
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <ActivityScoreCard />
          </motion.div>
        </div>

        {/* Carousel / Events Section */}
        <motion.div variants={itemVariants}>
          <CarouselSection />
        </motion.div>
      </motion.main>
    </div>
  );
}
