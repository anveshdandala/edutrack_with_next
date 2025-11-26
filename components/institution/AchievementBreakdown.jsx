import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const achievementTypes = [
  { name: "Internships", value: 30, color: "hsl(var(--primary))" },
  { name: "Certifications", value: 25, color: "hsl(var(--secondary))" },
  { name: "Hackathons", value: 20, color: "hsl(var(--accent))" },
  { name: "Research", value: 15, color: "hsl(var(--muted))" },
  { name: "Leadership", value: 10, color: "hsl(var(--destructive))" },
];

export function AchievementBreakdown() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Achievement Breakdown</CardTitle>
        <CardDescription>
          Distribution of achievement types across all students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={achievementTypes}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              dataKey="value"
            >
              {achievementTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
