"use client"; // Add this for Recharts and other client-side components
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  BarChart3,
  Calendar,
  Award,
  Mail,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";
import { useEffect } from "react";

// --- MOCK DATA ---
// In a real app, you would fetch this data based on the studentId
const studentData = {
  profile: {
    name: "Alex Doe",
    email: "alex.doe@university.edu",
    course: "Computer Science",
    avatarUrl: "https://github.com/shadcn.png", // Placeholder image
    overallGrade: "88%",
    attendance: "95%",
  },
  performance: {
    subjectScores: [
      { subject: "Data Structures", score: 92 },
      { subject: "Algorithms", score: 85 },
      { subject: "Database Systems", score: 88 },
      { subject: "Operating Systems", score: 78 },
      { subject: "Web Development", score: 95 },
      { subject: "Machine Learning", score: 89 },
    ],
    attendanceData: [
      { name: "Present", value: 114 },
      { name: "Absent", value: 6 },
    ],
  },
  certificates: [
    {
      id: 1,
      title: "Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      fileUrl: "/path/to/certificate1.pdf", // Placeholder link
    },
    {
      id: 2,
      title: "Python for Data Science",
      issuer: "Coursera",
      fileUrl: "/path/to/certificate2.pdf", // Placeholder link
    },
    {
      id: 3,
      title: "React - The Complete Guide",
      issuer: "Udemy",
      fileUrl: "/path/to/certificate3.pdf", // Placeholder link
    },
  ],
};
// --- END MOCK DATA ---

export default function StudentAnalysis() {
  const params = useParams();
  const tenant = params.tenant;
  useEffect(()=>{
    console.log("[analysis] tenant",tenant);
  })
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={false} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/faculty">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Analysis</h1>
            <p className="text-muted-foreground">
              Detailed analysis for {studentData.profile.name} (ID: 12345)
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile & Certificates */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={studentData.profile.avatarUrl}
                      alt={studentData.profile.name}
                    />
                    <AvatarFallback>
                      {studentData.profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      {studentData.profile.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" /> {studentData.profile.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <GraduationCap className="w-4 h-4" />{" "}
                      {studentData.profile.course}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">
                      {studentData.profile.overallGrade}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Overall Grade
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">
                      {studentData.profile.attendance}
                    </p>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificate Verification Card */}
            <Card>
              <CardHeader>
                <CardTitle>Certificate Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {studentData.certificates.map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{cert.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued by: {cert.issuer}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Verify <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Visualizations */}
          <div className="space-y-6">
            {/* Performance Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={studentData.performance.subjectScores}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={studentData.profile.name}
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentData.performance.attendanceData}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={60} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
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
