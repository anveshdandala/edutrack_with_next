import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const radarData = [
  { subject: "Academics", A: 85, B: 78, fullMark: 100 },
  { subject: "Technical Skills", A: 92, B: 85, fullMark: 100 },
  { subject: "Certifications", A: 78, B: 82, fullMark: 100 },
  { subject: "Internships", A: 88, B: 72, fullMark: 100 },
  { subject: "Leadership", A: 75, B: 88, fullMark: 100 },
  { subject: "Research", A: 82, B: 75, fullMark: 100 },
  { subject: "Co-Curricular", A: 90, B: 92, fullMark: 100 },
];

export function CompetencyChart() {
  return (
    <Card className="lg:col-span-2 bg-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">
              Institutional Competency Profile
            </CardTitle>
            <CardDescription>
              Comprehensive achievement overview across key performance areas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Current Year</Badge>
            <Badge variant="outline">Previous Year</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" className="text-sm" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
            <Radar
              name="Current Year"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
            <Radar
              name="Previous Year"
              dataKey="B"
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.1}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
