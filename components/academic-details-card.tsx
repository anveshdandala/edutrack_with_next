"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"; // 1. Import motion

export function AcademicDetailsCard() {
  return (
        <motion.div
      whileHover={{ scale: 1.03, y: -5 }} // 3. Add the scale and lift effect on hover
      transition={{ type: "spring", stiffness: 300, damping: 15 }} // 4. Make the animation smooth
    >

    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Academic Details</CardTitle>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">8.7</p>
              <p className="text-sm text-muted-foreground">Current CGPA</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <TrendingUp className="mr-1 h-3 w-3" />
              Excellent
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">87%</p>
              <p className="text-sm text-muted-foreground">Overall Percentage</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Recent Grades</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Structures</span>
              <Badge variant="outline">A+</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Web Development</span>
              <Badge variant="outline">A</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database Systems</span>
              <Badge variant="outline">A-</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
