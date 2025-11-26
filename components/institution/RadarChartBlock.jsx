"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

/**
 * Simple RadarChart block used by InsightsPanel.
 * Replace `radarData` with real data fetched from the API when ready.
 */
export default function RadarChartBlock({ radarData: propData }) {
  // sample fallback data (you can remove/replace)
  const radarData = propData ?? [
    { subject: "Academics", A: 85, B: 78, fullMark: 100 },
    { subject: "Technical Skills", A: 92, B: 85, fullMark: 100 },
    { subject: "Certifications", A: 78, B: 82, fullMark: 100 },
    { subject: "Internships", A: 88, B: 72, fullMark: 100 },
    { subject: "Leadership", A: 75, B: 88, fullMark: 100 },
    { subject: "Research", A: 82, B: 75, fullMark: 100 },
    { subject: "Co-Curricular", A: 90, B: 92, fullMark: 100 },
  ];

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Current Year"
            dataKey="A"
            stroke="hsl(var(--portfolio-accent))"
            fill="hsl(var(--portfolio-accent))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Previous Year"
            dataKey="B"
            stroke="hsl(var(--portfolio-primary))"
            fill="hsl(var(--portfolio-primary))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
