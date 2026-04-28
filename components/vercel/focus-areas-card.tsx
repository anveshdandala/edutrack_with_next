import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Target } from "lucide-react"

const focusAreas = [
  "Time management during exam periods needs improvement",
  "Increase participation in extracurricular activities",
  "Strengthen communication skills in presentations",
]

export function FocusAreasCard() {
  return (
    <Card className="border bg-card shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-500/10 p-2">
            <Target className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-lg">Focus Areas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {focusAreas.map((area, index) => (
          <div key={index} className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-muted-foreground">{area}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
