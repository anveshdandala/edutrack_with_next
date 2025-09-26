import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle } from "lucide-react"

const strengths = [
  "Improved problem-solving skills in mathematics by 23%",
  "Enhanced collaborative work in group projects",
  "Consistent attendance and active participation",
]

export function StrengthsImprovementsCard() {
  return (
    <Card className="bg-slate-100/50 border-green-500/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <CardTitle className="text-slate-900 text-lg">Strengths & Improvements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {strengths.map((strength, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-800 text-sm leading-relaxed">{strength}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
