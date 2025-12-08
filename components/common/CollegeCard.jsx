import { School, ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CollegeCard({ college, onSelect, disabled }) {
  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 group
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
      onClick={() => onSelect(college)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <School className="h-6 w-6 text-primary" />
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
      </CardHeader>
      <div className="p-6 pt-2">
        <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {college.name}
        </CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span className="font-medium text-foreground/80">{college.domain}</span>
          <span className="text-xs">schema: {college.schema_name}</span>
        </CardDescription>
      </div>
    </Card>
  );
}
