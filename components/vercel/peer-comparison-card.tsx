import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const comparisonData = [
  { metric: "Class Participation", student: 85, peerAverage: 72, color: "bg-blue-500" },
  { metric: "Activity Score", student: 78, peerAverage: 81, color: "bg-purple-500" },
]

export function PeerComparisonCard() {
  return (
    <Card className="border bg-card shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Peer Comparison</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {comparisonData.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{item.metric}</span>
              <div className="flex gap-4 text-xs">
                <span className="text-muted-foreground">You: {item.student}%</span>
                <span className="text-muted-foreground">Avg: {item.peerAverage}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Progress value={item.student} className="h-2" />
                </div>
                <div className="flex-1">
                  <Progress value={item.peerAverage} className="h-2 opacity-60" />
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-primary">Your Score</span>
                <span className="text-muted-foreground">Peer Average</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
