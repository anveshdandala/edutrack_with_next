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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const certificateTypes = [
  { id: "seminars", title: "Seminars", icon: Users },
  { id: "conferences", title: "Conferences", icon: Award },
  { id: "moocs", title: "MOOCs", icon: GraduationCap },
  { id: "internships", title: "Internships", icon: Briefcase },
  { id: "extracurricular", title: "Extra-curriculars", icon: FileText },
];

const verifiedCertificates = [
  {
    id: 1,
    type: "seminars",
    name: "AI Workshop Certificate",
    link: "https://example.com/cert1",
    date: "2024-02-15",
    issuer: "Tech Academy",
  },
  {
    id: 2,
    type: "conferences",
    name: "IEEE Conference 2024",
    link: "https://example.com/cert2",
    date: "2024-01-20",
    issuer: "IEEE",
  },
  {
    id: 3,
    type: "moocs",
    name: "Coursera ML Course",
    link: "https://example.com/cert3",
    date: "2024-02-28",
    issuer: "Coursera",
  },
  {
    id: 4,
    type: "internships",
    name: "Summer Internship 2024",
    link: "https://example.com/cert4",
    date: "2024-02-10",
    issuer: "Tech Corp",
  },
  {
    id: 5,
    type: "seminars",
    name: "Blockchain Seminar",
    link: "https://example.com/cert5",
    date: "2024-03-01",
    issuer: "Web3 Academy",
  },
];

export default function CertificatesPage() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [selectedType, setSelectedType] = useState("seminars");
  const [verificationLink, setVerificationLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCertificate = async () => {
    if (!verificationLink.trim()) return;

    setIsSubmitting(true);
    // Simulate verification process
    setTimeout(() => {
      setIsSubmitting(false);
      setVerificationLink("");
      // Here you would typically handle the actual certificate submission
    }, 1500);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/student")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Certificate Type Dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Certificate Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    {certificateTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verification Link Input */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium">
                    Verification Link
                  </label>
                  <input
                    type="url"
                    placeholder="Enter certificate verification link"
                    value={verificationLink}
                    onChange={(e) => setVerificationLink(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddCertificate}
                disabled={isSubmitting || !verificationLink.trim()}
                className="w-full md:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isSubmitting ? "Verifying..." : "Add Certificate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Verified Certificates</h2>

          <div className="relative group">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth" }}
            >
              {verifiedCertificates.length > 0 ? (
                verifiedCertificates.map((cert) => (
                  <Card
                    key={cert.id}
                    className="flex-shrink-0 w-80 snap-center"
                  >
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">
                        {cert.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {cert.issuer}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        ✓ Verified
                      </Badge>
                      <div className="text-xs space-y-2">
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {
                            certificateTypes.find((t) => t.id === cert.type)
                              ?.title
                          }
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {cert.date}
                        </p>
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          View Certificate →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-40 text-muted-foreground">
                  <p>No verified certificates yet. Add one to get started!</p>
                </div>
              )}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
