"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const progressData = [
  { week: "Week 1", improvement: 65, target: 70 },
  { week: "Week 2", improvement: 72, target: 75 },
  { week: "Week 3", improvement: 78, target: 80 },
  { week: "Week 4", improvement: 85, target: 85 },
]

export function MonthlyProgressChart() {
  return (
    <Card className="bg-slate-100/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-grey-100 text-xl font-semibold">Statistical Improvement</CardTitle>
        <p className="text-slate-800 text-sm">Monthly progress tracking over 4 weeks</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            improvement: {
              label: "Progress Score",
              color: "hsl(200, 100%, 60%)",
            },
            target: {
              label: "Target",
              color: "hsla(44, 55%, 59%, 1.00)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(200, 100%, 60%)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(200, 100%, 60%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 27%)" />
              <XAxis dataKey="week" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="improvement"
                stroke="hsl(200, 100%, 60%)"
                strokeWidth={3}
                dot={{ fill: "hsl(200, 100%, 60%)", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "hsl(200, 100%, 60%)", strokeWidth: 2, fill: "hsl(200, 100%, 80%)" }}
                filter="drop-shadow(0 0 8px hsl(200, 100%, 60%))"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsla(0, 52%, 35%, 1.00)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
