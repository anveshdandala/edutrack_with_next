"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchWithAuth } from "@/lib/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RecentAchievements() {
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
    {
      student: "Anjali Patel",
      department: "IT",
      achievement: "Google Summer of Code Selection",
      verifier: "Dr. Mehta",
      time: "6 hours ago",
    },
  ];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const isCreated = Boolean(success);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Department name is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "http://127.0.0.1:8000/create-department",
        {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            description: description,
          }),
        }
      );
      // fetchWithAuth returns parsed JSON or throws — check content if needed
      console.log("create-department response:", response);
      if (!response) {
        console.log("failed to post department");
        setError("Failed to create department");
      } else {
        setSuccess("Department created successfully");
        setName("");
        setDescription("");
      }

      // If backend returns 201 with body, handle it; otherwise handle accordingly
    } catch (err) {
      setError(err.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8">
        <div className="mb-8">
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
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description about the department"
                className="w-full border rounded px-3 py-2 min-h-[80px] resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                {success}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading || isCreated}
                className={`flex-1 ${
                  isCreated ? "bg-emerald-600 hover:bg-emerald-600" : ""
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
                onClick={() => {
                  setName("");
                  setDescription("");
                  setError(null);
                  setSuccess("");
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Card className="bg-card">
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
                <div className="flex-1">
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
    </>
  );
}
