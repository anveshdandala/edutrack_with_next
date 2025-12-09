"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft, Mail, MapPin, Phone, GraduationCap, Calendar
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Tooltip, BarChart, XAxis, YAxis, 
  CartesianGrid, Bar
} from "recharts";

// Mock Performance Data (Merge with real API later)
const MOCK_PERFORMANCE = {
  subjectScores: [
    { subject: "Data Structures", score: 88 },
    { subject: "Algorithms", score: 72 },
    { subject: "Database", score: 95 },
    { subject: "OS", score: 85 },
    { subject: "Web Dev", score: 90 },
  ],
  attendance: [
    { name: "Present", value: 85 },
    { name: "Absent", value: 15 },
  ]
};

export default function StudentAnalysisUI({ student, tenant }) {
  
  // 1. Data Mapping
  // API returns flat structure: { first_name, last_name, roll_number, etc. }
  const fullName = student.first_name 
    ? `${student.first_name} ${student.last_name}` 
    : student.username;
    
  const initials = fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  
  // Map Department ID to Name if API returns ID (e.g., 0)
  // Ideally backend should return string, but we handle the integer case
  const deptLabel = student.department === 0 ? "Computer Science" : student.department;

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar showAuthButtons={false} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100">
            <Link href={`/${tenant}/faculty`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Student Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Roll No: <span className="font-mono text-primary">{student.roll_number}</span>
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-t-4 border-t-blue-600 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                  <p className="text-sm text-gray-500 mb-4 font-medium">{deptLabel}</p>

                  <div className="w-full space-y-3 text-left bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-gray-500 text-xs uppercase font-bold">Semester</span>
                        <span className="font-bold text-gray-700">{student.current_semester}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-gray-500 text-xs uppercase font-bold">Batch</span>
                        <span className="font-bold text-gray-700">{student.batch_year}</span>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500" /> 
                            <span className="truncate">{student.email}</span>
                        </div>
                        {student.phone_number && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-4 h-4 text-green-500" /> 
                                <span>{student.phone_number}</span>
                            </div>
                        )}
                        {student.city && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-4 h-4 text-red-500" /> 
                                <span>{student.city}, {student.state}</span>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Subject Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_PERFORMANCE.subjectScores}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={MOCK_PERFORMANCE.attendance} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}