import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const comparisonData = [
  { metric: "Class Participation", student: 85, peerAverage: 72, color: "bg-blue-500" },
  { metric: "Activity Score", student: 78, peerAverage: 81, color: "bg-purple-500" },
]

export function PeerComparisonCard() {
  return (
    <Card className="bg-slate-100/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <CardTitle className="text-slate-900 text-lg">Peer Comparison</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {comparisonData.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-800 text-sm font-medium">{item.metric}</span>
              <div className="flex gap-4 text-xs">
                <span className="text-slate-400">You: {item.student}%</span>
                <span className="text-slate-500">Avg: {item.peerAverage}%</span>
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
                <span className="text-blue-400">Your Score</span>
                <span className="text-slate-500">Peer Average</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
