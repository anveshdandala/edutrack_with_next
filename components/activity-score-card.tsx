"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowRight, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"; // 1. Import motion

export function ActivityScoreCard() {
  const router = useRouter()

  const handleNavigateToUploads = () => {
    router.push("/certificates")
  }

  return (
     <motion.div
      whileHover={{ scale: 1.03, y: -5 }} // 3. Add the scale and lift effect on hover
      transition={{ type: "spring", stiffness: 300, damping: 15 }} // 4. Make the animation smooth
    >
    <Card className="h-full cursor-pointer transition-all hover:shadow-lg" onClick={handleNavigateToUploads}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Activity Score</CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">85</p>
              <p className="text-sm text-muted-foreground">Risk/Activity Score</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              <Award className="mr-1 h-3 w-3" />
              Active
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Recent Activities</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Internship Completed</span>
              <Badge variant="outline" className="text-green-600">
                Approved
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Conference Attended</span>
              <Badge variant="outline" className="text-yellow-600">
                Pending
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">MOOC Certificate</span>
              <Badge variant="outline" className="text-green-600">
                Approved
              </Badge>
            </div>
          </div>
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          Upload Certificates
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
    </motion.div>
  );
}

