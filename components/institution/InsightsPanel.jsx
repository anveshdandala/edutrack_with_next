"use client";
import dynamic from "next/dynamic";

const RadarChartBlock = dynamic(() => import("./RadarChartBlock"), {
  ssr: false,
});

export default function InsightsPanel() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-2">Insights</h3>
      <RadarChartBlock />
    </div>
  );
}
