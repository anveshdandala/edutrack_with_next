import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Target } from "lucide-react"

const focusAreas = [
  "Time management during exam periods needs improvement",
  "Increase participation in extracurricular activities",
  "Strengthen communication skills in presentations",
]

export function FocusAreasCard() {
  return (
    <Card className="bg-slate-100/50 border-amber-500/30 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Target className="h-5 w-5 text-amber-400" />
          </div>
          <CardTitle className="text-slate-900 text-lg">Focus Areas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {focusAreas.map((area, index) => (
          <div key={index} className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-800 text-sm leading-relaxed">{area}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
