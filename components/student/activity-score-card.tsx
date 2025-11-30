"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowRight,ChevronRight, Award, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"; // 1. Import motion

export function ActivityScoreCard() {
  const router = useRouter()

  
  return (
    <Card 
      className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden"
      onClick={() => router.push("/student/certificates")}
    >
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 p-16 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-base font-semibold">Activity Score</CardTitle>
        </div>
        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
          Active
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">850</span>
              <span className="text-sm text-muted-foreground font-medium">XP</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Top 15% of your batch</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Visual Level Bar */}
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
                <span>Level 4</span>
                <span className="text-muted-foreground">850 / 1000 XP</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 to-blue-500 w-[85%]" />
            </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Achievements</h4>
          <div className="space-y-2">
            {[
              { title: "Internship Completed", status: "Approved", color: "text-green-600 bg-green-500/10" },
              { title: "Tech Symposium 2024", status: "Pending", color: "text-amber-600 bg-amber-500/10" },
              { title: "Python Certification", status: "Verified", color: "text-blue-600 bg-blue-500/10" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <Badge variant="secondary" className={`text-xs ${item.color} border-0`}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
            <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="secondary">
                Upload New Certificate
                <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

