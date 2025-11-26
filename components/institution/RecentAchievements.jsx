import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentAchievements = [
  {
    student: "Priya Sharma",
    department: "CSE",
    achievement: "Won Smart India Hackathon 2024",
    verifier: "Dr. Anand",
    time: "2 hours ago",
  },
  {
    student: "Rahul Kumar",
    department: "ECE",
    achievement: "AWS Solutions Architect Certification",
    verifier: "Prof. Singh",
    time: "4 hours ago",
  },
  {
    student: "Anjali Patel",
    department: "IT",
    achievement: "Google Summer of Code Selection",
    verifier: "Dr. Mehta",
    time: "6 hours ago",
  },
];

export function RecentAchievements() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
        <CardDescription>
          Latest verified student accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAchievements.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.student}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.achievement}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{item.department}</Badge>
                  <Badge variant="outline">Verified by {item.verifier}</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
