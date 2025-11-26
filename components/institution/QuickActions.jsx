import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
        <CardDescription>Generate reports and manage data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate NAAC Report
        </Button>
        <Link href="/institution/students/upload" className="block">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            📤 Upload Students Data
          </Button>
        </Link>
        <Link href="/institution/hods/create" className="block">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            👨‍🏫 Create HOD
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
