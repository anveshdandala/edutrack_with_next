import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Clock, Star, TrendingUp } from "lucide-react";

export function KPICards() {
  const kpiCards = [
    { title: "Total Students", value: "2,847", icon: Users, trend: "+12%" },
    {
      title: "Achievements Logged",
      value: "1,523",
      icon: Trophy,
      trend: "+28%",
    },
    { title: "Verification Pending", value: "47", icon: Clock, trend: "-15%" },
    {
      title: "Top Department",
      value: "Computer Science",
      icon: Star,
      trend: "",
    },
    {
      title: "Most Common Achievement",
      value: "Internships",
      icon: TrendingUp,
      trend: "+8%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="bg-card hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
                {kpi.trend && (
                  <p
                    className={`text-xs mt-1 ${
                      kpi.trend.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {kpi.trend} from last month
                  </p>
                )}
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <kpi.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
