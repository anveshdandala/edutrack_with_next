import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { month: "Jan", achievements: 45 },
  { month: "Feb", achievements: 52 },
  { month: "Mar", achievements: 78 },
  { month: "Apr", achievements: 65 },
  { month: "May", achievements: 88 },
  { month: "Jun", achievements: 95 },
  { month: "Jul", achievements: 72 },
  { month: "Aug", achievements: 85 },
  { month: "Sep", achievements: 92 },
  { month: "Oct", achievements: 88 },
  { month: "Nov", achievements: 76 },
  { month: "Dec", achievements: 82 },
];

export function AchievementTrends() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Achievement Trends</CardTitle>
        <CardDescription>
          Track achievement logging patterns throughout the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="achievements"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
