"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
} from "recharts";
import { Plus, Minus, ExternalLink, Users, TrendingUp } from "lucide-react";

// Mock data for assigned students
const assignedStudents = [
  {
    id: "STU001",
    name: "Arjun Sharma",
    rollNumber: "21CS001",
    department: "Computer Science",
    year: "3rd Year",
    activityScore: 85,
  },
  {
    id: "STU002",
    name: "Priya Patel",
    rollNumber: "21CS002",
    department: "Computer Science",
    year: "3rd Year",
    activityScore: 92,
  },
  {
    id: "STU003",
    name: "Rahul Kumar",
    rollNumber: "21EC001",
    department: "Electronics",
    year: "2nd Year",
    activityScore: 78,
  },
  {
    id: "STU004",
    name: "Sneha Reddy",
    rollNumber: "21ME001",
    department: "Mechanical",
    year: "4th Year",
    activityScore: 88,
  },
];

// Mock data for performance chart
const performanceData = [
  { name: "Math", score: 86 },
  { name: "Science", score: 92 },
  { name: "History", score: 68 },
  { name: "English", score: 89 },
  { name: "Art", score: 95 },
  { name: "Music", score: 81 },
  { name: "P.E.", score: 75 },
]; // Mock data for internships/events
const internshipsEvents = [
  {
    id: 1,
    title: "Google Summer of Code 2024",
    description: "Open source development program for students",
    type: "internship",
  },
  {
    id: 2,
    title: "Tech Conference 2024",
    description: "Annual technology conference with industry leaders",
    type: "event",
  },
  {
    id: 3,
    title: "Microsoft Internship Program",
    description: "Software engineering internship opportunity",
    type: "internship",
  },
  {
    id: 4,
    title: "AI Workshop Series",
    description: "Hands-on workshop on artificial intelligence",
    type: "event",
  },
];

export default function FacultyDashboard() {
  const [recommendations, setRecommendations] = useState({});

  const handleRecommendation = (id, action) => {
    setRecommendations((prev) => ({
      ...prev,
      [id]: action,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={false} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">
            Manage students and track their performance
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel - Assigned Students (1/3) */}
          <div className="lg:col-span-1">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 h-[320px] overflow-y-auto">
                {assignedStudents.map((student) => (
                  <Link
                    key={student.id}
                    href={`/faculty/analysis/${student.id}`}
                    className="block"
                  >
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm">
                              {student.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {student.activityScore}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {student.rollNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.department} • {student.year}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Performance Overview (2/3) */}
          <div className="lg:col-span-2">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Student Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="name" />

                      <YAxis domain={[0, 100]} />

                      <Tooltip />

                      <Bar dataKey="score" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Internships & Events */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recommended Internships & Events</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Add New College Tech Event
                </Button>
                <Button asChild size="sm">
                  <Link href="/faculty/internships">
                    View All <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {internshipsEvents.map((item) => (
                <Card key={item.id} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            recommendations[item.id] === "positive"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleRecommendation(item.id, "positive")
                          }
                          className="flex-1"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Recommend
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            recommendations[item.id] === "negative"
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() =>
                            handleRecommendation(item.id, "negative")
                          }
                          className="flex-1"
                        >
                          <Minus className="w-3 h-3 mr-1" />
                          Discard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
