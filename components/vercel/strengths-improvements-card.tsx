import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle } from "lucide-react"

const strengths = [
  "Improved problem-solving skills in mathematics by 23%",
  "Enhanced collaborative work in group projects",
  "Consistent attendance and active participation",
]

export function StrengthsImprovementsCard() {
  return (
    <Card className="border bg-card shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-emerald-500/10 p-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <CardTitle className="text-lg">Strengths & Improvements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {strengths.map((strength, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <p className="text-sm leading-relaxed text-muted-foreground">{strength}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
