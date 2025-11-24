"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/components/useAuth";
import CreateDepartment from "@/components/institution/CreateDepartment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Trophy,
  Clock,
  Star,
  TrendingUp,
  Download,
  FileText,
  Award,
  Shield,
  Activity,
  Calendar,
  Filter,
  Upload,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth.js";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import HodCreation from "@/components/institution/hodCreation";
const Institution = () => {
  const K_ACCESS = "accesstoken";
  const K_REFRESH = "refreshtoken";
  const { instAdmin } = useAuth();
  const [hodexists, setHodexists] = useState(false);

  // Sample data for charts
  const radarData = [
    { subject: "Academics", A: 85, B: 78, fullMark: 100 },
    { subject: "Technical Skills", A: 92, B: 85, fullMark: 100 },
    { subject: "Certifications", A: 78, B: 82, fullMark: 100 },
    { subject: "Internships", A: 88, B: 72, fullMark: 100 },
    { subject: "Leadership", A: 75, B: 88, fullMark: 100 },
    { subject: "Research", A: 82, B: 75, fullMark: 100 },
    { subject: "Co-Curricular", A: 90, B: 92, fullMark: 100 },
  ];

  const monthlyData = [
    { month: "Jan", achievements: 45 },
    { month: "Feb", achievements: 52 },
    { month: "Mar", achievements: 78 },
    { month: "Apr", achievements: 65 },
    { month: "May", achievements: 88 },
    { month: "Jun", achievements: 95 },
    { month: "Jul", achievements: 72 },
    { month: "Aug", achievements: 85 },
    { month: "Sep", achievements: 92 },
    { month: "Oct", achievements: 88 },
    { month: "Nov", achievements: 76 },
    { month: "Dec", achievements: 82 },
  ];

  const achievementTypes = [
    { name: "Internships", value: 30, color: "hsl(var(--portfolio-accent))" },
    { name: "Certifications", value: 25, color: "hsl(217.2, 32.6%, 17.5%)" },
    { name: "Hackathons", value: 20, color: "hsl(var(--portfolio-primary))" },
    { name: "Research", value: 15, color: "hsl(var(--portfolio-text-light))" },
    { name: "Leadership", value: 10, color: "hsl(210, 40%, 96.1%)" },
  ];

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
    {
      student: "Vikram Singh",
      department: "CSE",
      achievement: "Published Paper in IEEE Conference",
      verifier: "Dr. Gupta",
      time: "1 day ago",
    },
    {
      student: "Sneha Reddy",
      department: "ECE",
      achievement: "Microsoft Internship Completion",
      verifier: "Prof. Rao",
      time: "1 day ago",
    },
  ];

  const kpiCards = [
    { title: "Total Students", value: "2,847", icon: Users, trend: "+12%" },
    {
      title: "Achievements Logged",
      value: "1,523",
      icon: Trophy,
      trend: "+28%",
    },
    { title: "Verification Pending", value: "47", icon: Clock, trend: "-15%" },
    {
      title: "Top Department",
      value: "Computer Science",
      icon: Star,
      trend: "",
    },
    {
      title: "Most Common Achievement",
      value: "Internships",
      icon: TrendingUp,
      trend: "+8%",
    },
  ];
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [hodData, setHodData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    department: "",
    username: "",
    email: "",
    password: "",
  });

  const { user } = useAuth();

  const handleFileChanges = (e) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    setError(null);
    console.log("selected file:", f?.name);
  };

  const handleHodInputChange = (field, value) =>
    setHodData((prev) => ({ ...prev, [field]: value }));

  const postHod = async (e) => {
    e.preventDefault();
    console.log("hod details:", hodData); // Now logs the actual object

    setLoading(true);
    setError(null);
    try {
      const access = localStorage.getItem(K_ACCESS);
      console.log("[institutio] access:", access);
      const res = await fetch("http://127.0.0.1:8000/create-hod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify(hodData),
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(json?.detail ?? JSON.stringify(json));
      }

      console.log("HOD created successfully:", json);
      setHodexists(true);
      setHodData({
        first_name: "",
        last_name: "",
        role: "",
        department: "",
        username: "",
        email: "",
        password: "",
      }); // Reset form
    } catch (err) {
      console.error("postHod error:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const uploadStudents = async () => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("role", "STUDENT");
      form.append("body", "MY_COLLEGE_CODE");
      console.log(
        "selectedFile:",
        selectedFile?.name,
        selectedFile?.type,
        selectedFile?.size
      );

      const access = localStorage.getItem(K_ACCESS);

      const res = await fetch("http://127.0.0.1:8000/create-bulk-profiles", {
        method: "POST",
        headers: access
          ? {
              Authorization: `Bearer ${access}`,
            }
          : undefined,

        body: form,
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(json?.detail ?? JSON.stringify(json));
      }

      setData(json);
      console.log("upload success:", json);
    } catch (err) {
      console.error("uploadStudents error", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-portfolio-muted to-portfolio-secondary">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-portfolio-accent/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-portfolio-text">
                Institution Dashboard
              </h1>
              <p className="text-portfolio-text-light mt-2">
                Comprehensive overview for accreditation and institutional
                reporting
              </p>
            </div>
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics</SelectItem>
                  <SelectItem value="mech">Mechanical</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024-25</SelectItem>
                  <SelectItem value="2023">2023-24</SelectItem>
                  <SelectItem value="2022">2022-23</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <CreateDepartment />
      </div>

      <div className="create-hod mb-6 bg-white/80 backdrop-blur-sm border-b border-portfolio-accent/20">
        {hodexists ? (
          <div>HOD already exists</div>
        ) : (
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-portfolio-text mb-6">
              Add HOD
            </h2>
            <HodCreation />
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-portfolio-text-light mb-1">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-portfolio-text">
                      {kpi.value}
                    </p>
                    {kpi.trend && (
                      <p
                        className={`text-xs mt-1 ${
                          kpi.trend.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {kpi.trend} from last month
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-portfolio-accent/10 rounded-full">
                    <kpi.icon className="w-6 h-6 text-portfolio-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Radar Chart - Main Centerpiece */}
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-portfolio-text">
                    Institutional Competency Profile
                  </CardTitle>
                  <CardDescription className="text-portfolio-text-light">
                    Comprehensive achievement overview across key performance
                    areas
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-portfolio-accent/10 text-portfolio-accent border-portfolio-accent/30"
                  >
                    Current Year
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-portfolio-primary/10 text-portfolio-primary border-portfolio-primary/30"
                  >
                    Previous Year
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    className="text-sm fill-portfolio-text"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-xs fill-portfolio-text-light"
                  />
                  <Radar
                    name="Current Year"
                    dataKey="A"
                    stroke="hsl(var(--portfolio-accent))"
                    fill="hsl(var(--portfolio-accent))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Previous Year"
                    dataKey="B"
                    stroke="hsl(var(--portfolio-primary))"
                    fill="hsl(var(--portfolio-primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid hsl(var(--portfolio-accent))",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-card)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions & Reports */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-xl text-portfolio-text">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-portfolio-text-light">
                Generate reports and manage data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-portfolio-accent hover:bg-portfolio-accent/90 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Generate NAAC Report
              </Button>

              <div>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChanges}
                  className="mb-3"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={uploadStudents}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {loading ? "Uploading..." : "Add students data"}
                  </Button>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-xl text-portfolio-text">
                Monthly Achievement Trends
              </CardTitle>
              <CardDescription className="text-portfolio-text-light">
                Track achievement logging patterns throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--portfolio-text-light) / 0.2)"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-sm fill-portfolio-text"
                  />
                  <YAxis className="text-sm fill-portfolio-text" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid hsl(var(--portfolio-accent))",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-card)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="achievements"
                    stroke="hsl(var(--portfolio-accent))"
                    strokeWidth={3}
                    dot={{
                      fill: "hsl(var(--portfolio-accent))",
                      strokeWidth: 2,
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Achievement Type Distribution */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-xl text-portfolio-text">
                Achievement Breakdown
              </CardTitle>
              <CardDescription className="text-portfolio-text-light">
                Distribution of achievement types across all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={achievementTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      dataKey="value"
                    >
                      {achievementTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid hsl(var(--portfolio-accent))",
                        borderRadius: "8px",
                        boxShadow: "var(--shadow-card)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {achievementTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className="text-sm text-portfolio-text-light">
                      {type.name}
                    </span>
                    <span className="text-sm font-medium text-portfolio-text ml-auto">
                      {type.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-portfolio-text">
                  Recent Verified Achievements
                </CardTitle>
                <CardDescription className="text-portfolio-text-light">
                  Latest student achievements approved by faculty
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-portfolio-accent text-portfolio-accent hover:bg-portfolio-accent/10"
              >
                <Activity className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-portfolio-muted to-white border border-portfolio-accent/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-portfolio-accent/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-portfolio-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-portfolio-text">
                        {achievement.student} ({achievement.department})
                      </p>
                      <p className="text-sm text-portfolio-text-light">
                        {achievement.achievement}
                      </p>
                      <p className="text-xs text-portfolio-text-light">
                        Verified by {achievement.verifier}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-portfolio-text-light">
                      {achievement.time}
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Institution;
