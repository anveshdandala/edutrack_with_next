"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Users,
  Activity,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const certificateTypes = [
  {
    id: "seminars",
    title: "Seminars",
    icon: Users,
    description: "Upload certificates from seminars and workshops",
    uploads: [
      {
        name: "AI Workshop Certificate.pdf",
        status: "approved",
        date: "2024-02-15",
      },
      { name: "Blockchain Seminar.pdf", status: "pending", date: "2024-03-01" },
    ],
  },
  {
    id: "conferences",
    title: "Conferences",
    icon: Award,
    description: "Upload certificates from academic conferences",
    uploads: [
      {
        name: "IEEE Conference 2024.pdf",
        status: "approved",
        date: "2024-01-20",
      },
    ],
  },
  {
    id: "moocs",
    title: "MOOCs",
    icon: GraduationCap,
    description: "Upload certificates from online courses",
    uploads: [
      {
        name: "Coursera ML Course.pdf",
        status: "approved",
        date: "2024-02-28",
      },
      { name: "edX Data Science.pdf", status: "pending", date: "2024-03-05" },
    ],
  },
  {
    id: "internships",
    title: "Internships",
    icon: Briefcase,
    description: "Upload internship completion certificates",
    uploads: [
      {
        name: "Summer Internship 2024.pdf",
        status: "approved",
        date: "2024-02-10",
      },
    ],
  },
  {
    id: "extracurricular",
    title: "Extra-curriculars",
    icon: FileText,
    description: "Upload certificates from extra-curricular activities",
    uploads: [
      { name: "Debate Competition.pdf", status: "pending", date: "2024-03-08" },
    ],
  },
];

export default function CertificatesPage() {
  const router = useRouter();
  const [uploadingType, setUploadingType] = useState(null);

  const handleUpload = (typeId) => {
    setUploadingType(typeId);
    // Simulate upload process
    setTimeout(() => {
      setUploadingType(null);
      // Here you would typically handle the actual file upload
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/student")}>
            <ArrowLeft className="h-6  mr-2" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Certificate Uploads</h1>
                <p className="text-muted-foreground">
                  Upload and manage your academic certificates
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Activity Score:</span>
                  <span className="text-lg font-bold text-primary">85</span>
                </div>
                <Button
                  onClick={() => router.push("/portfolio")}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificateTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card key={type.id} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {type.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => handleUpload(type.id)}
                    disabled={uploadingType === type.id}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingType === type.id
                      ? "Uploading..."
                      : "Upload Certificate"}
                  </Button>

                  {type.uploads.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Uploads</h4>
                      {type.uploads.map((upload, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {upload.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {upload.date}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(upload.status)}
                          >
                            {upload.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
