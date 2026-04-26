// src/components/ui/AnimatedRadialProgress.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function AnimatedRadialProgress({
  value,
  max = 10,
  label,
  colorClass = "text-primary",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const circumference = 2 * Math.PI * 45; // Circle radius is 45

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: value / max,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center"
    >
      <svg width="120" height="120" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          variants={draw}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
