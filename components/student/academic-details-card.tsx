"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, MoreHorizontal,  } from "lucide-react"
import { motion } from "framer-motion"; // 1. Import motion
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export function AcademicDetailsCard() {
  return (
           <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-base font-semibold">Academic Overview</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">CGPA</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">8.7</span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.2 this sem
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Attendance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">87%</span>
            </div>
            <Progress value={87} className="h-2"/>
          </div>
        </div>

        {/* Recent Grades List */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Performance</h4>
          <div className="space-y-3">
            {[
              { subject: "Data Structures", grade: "A+", score: 98 },
              { subject: "Web Development", grade: "A", score: 92 },
         
            ].map((item, index) => (
              <motion.div 
                key={item.subject}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <span className="text-xs text-muted-foreground">Semester 4</span>
                </div>
                <Badge variant={item.grade.includes("+") ? "default" : "secondary"} className="font-mono">
                  {item.grade}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
