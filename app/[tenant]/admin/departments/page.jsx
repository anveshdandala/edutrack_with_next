"use client";
import { useState } from "react";
import { useParams } from "next/navigation"; // <--- Required to get tenant
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DepartmentManager() {
  // Renamed for clarity
  const params = useParams();
  const tenant = params?.tenant; // <--- Get Tenant from URL

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const isCreated = Boolean(success);

  // Mock data for display
  const recentAchievements = [
    {
      student: "Priya Sharma",
      department: "CSE",
      achievement: "Won Smart India Hackathon 2024",
      verifier: "Dr. Anand",
      time: "2 hours ago",
    },
    {
      student: "Rahul Kumar",
      department: "ECE",
      achievement: "AWS Solutions Architect Certification",
      verifier: "Prof. Singh",
      time: "4 hours ago",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Pass tenant in the URL Query String
      const response = await fetch(`/api/admin/departments/create?tenant=${tenant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create department");
      }

      setSuccess("Department created successfully");
      setName("");
      setCode("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Department Management</h1>
        <p className="text-gray-600 text-sm mt-2">
          Create and manage departments
        </p>
      </div>

      <div className="max-w-2xl bg-white/80 backdrop-blur rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Department Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Department Code
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CSE"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
              {success}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || isCreated}
              className={`flex-1 ${
                isCreated ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              {loading
                ? "Creating..."
                : isCreated
                ? "Created ✓"
                : "Create Department"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName("");
                setCode("");
                setError(null);
                setSuccess("");
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>
            Latest verified student accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAchievements.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {item.student}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.achievement}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{item.department}</Badge>
                    <Badge variant="outline">Verified by {item.verifier}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
