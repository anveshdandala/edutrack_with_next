"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart3, TrendingUp, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Mapping colors to category keys
const COLORS = {
  mooc: "#3b82f6", // Blue
  sports: "#ef4444", // Red
  extension: "#10b981", // Green
  internship: "#f59e0b", // Amber
  project: "#8b5cf6", // Violet
  technical: "#6366f1", // Indigo
  research: "#ec4899", // Pink
  other: "#9ca3af", // Gray
};

export default function StudentAnalytics({ tenant }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/student/achievements?tenant=${tenant}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (tenant) fetchStats();
  }, [tenant]);

  // Transform data for Pie Chart
  const pieData = useMemo(() => {
    if (!data?.certificates) return [];

    // Convert object { mooc: 9, sports: 0 } to array [{ name: 'MOOC', value: 9 }]
    return Object.entries(data.certificates)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
        value: value,
        color: COLORS[key] || "#000",
      }))
      .filter((item) => item.value > 0); // Only show non-zero
  }, [data]);

  // Calculate Stats for Bar Chart
  const totalCerts = pieData.reduce((acc, curr) => acc + curr.value, 0);
  const maxVal = Math.max(...pieData.map((d) => d.value), 10); // Dynamic max for bars

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center rounded-md border bg-card">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="rounded-md border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            Performance Overview
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Academic metrics and certification distribution
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <TrendingUp size={14} className="text-primary" />
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
        <div className="xl:col-span-7 h-64 flex items-end justify-between gap-2 px-2 xl:border-r xl:border-border xl:pr-8">
          {pieData.length === 0 ? (
            <p className="text-sm text-muted-foreground w-full text-center self-center">
              No achievement data found.
            </p>
          ) : (
            pieData.map((stat, idx) => {
              const percentage = (stat.value / maxVal) * 100;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end h-full w-full group"
                >
                  <div className="w-full max-w-[48px] bg-muted rounded-t-md relative h-full flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-t-md transition-all duration-1000 ease-out opacity-90 group-hover:opacity-100"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: stat.color,
                      }}
                    ></div>
                  </div>
                  <div className="mt-3 text-center">
                    <p
                      className="text-[10px] font-bold text-foreground uppercase truncate w-full max-w-[60px]"
                      title={stat.name}
                    >
                      {stat.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="xl:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="w-full h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">
                {totalCerts}
              </span>
              <span className="text-xs text-muted-foreground font-medium">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
            {pieData.length > 4 && (
              <span className="text-xs text-gray-400">
                +{pieData.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
