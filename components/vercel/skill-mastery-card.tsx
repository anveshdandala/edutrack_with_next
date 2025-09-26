import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

const skills = [
  { name: "Mathematics", progress: 85, color: "text-blue-400" },
  { name: "Science", progress: 78, color: "text-green-400" },
  { name: "Literature", progress: 92, color: "text-purple-400" },
  { name: "History", progress: 74, color: "text-orange-400" },
  { name: "Programming", progress: 88, color: "text-cyan-400" },
  { name: "Art", progress: 67, color: "text-pink-400" },
]

export function SkillMasteryCard() {
  return (
    <Card className="bg-slate-100/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <CardTitle className="text-slate-900 text-lg">Skill Mastery</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(215, 25%, 27%)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${skill.progress}, 100`}
                    className={skill.color}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-slate-900">{skill.progress}%</span>
                </div>
              </div>
              <span className="text-xs text-slate-800 text-center font-medium">{skill.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
