"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
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

const certificateTypes = [
  { id: "seminars", title: "Seminars", icon: Users },
  { id: "conferences", title: "Conferences", icon: Award },
  { id: "moocs", title: "MOOCs", icon: GraduationCap },
  { id: "internships", title: "Internships", icon: Briefcase },
  { id: "extracurricular", title: "Extra-curriculars", icon: FileText },
];

export default function CertificateClientWrapper({
  user,
  initialCertificates,
}) {
  const router = useRouter();
  const params = useParams();

  // 1. Get Tenant from URL params
  const tenant = params.tenant;

  // State
  const scrollRef = useRef(null);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [selectedType, setSelectedType] = useState("seminars");
  const [verificationLink, setVerificationLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Auth Protection (Client Side Guard)
  useEffect(() => {
    // FIX: Redirect to the TENANT SPECIFIC login page, not global /auth/login
    if (!user) {
      router.push(`/${tenant}/auth/login`);
    }
  }, [user, router, tenant]);

  // Logic Handlers
  const handleAddCertificate = async () => {
    if (!verificationLink.trim()) return;
    setIsSubmitting(true);

    // Simulate API Call
    setTimeout(() => {
      const newCert = {
        id: Date.now(),
        type: selectedType,
        name: "New Verified Certificate",
        link: verificationLink,
        date: new Date().toISOString().split("T")[0],
        issuer: "Pending Issuer",
      };
      setCertificates([newCert, ...certificates]);
      setIsSubmitting(false);
      setVerificationLink("");
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

  // If no user yet, don't render the sensitive UI (prevents flash)
  if (!user) return null;

  return (
    <>
      {/* Navigation & Actions Toolbar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Activity Score:</span>
                <span className="text-lg font-bold text-primary">85</span>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/${tenant}/student/portfolio/professional-portfolio`
                  )
                }
              >
                portfolio
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/${tenant}/student/portfolio/personal-portfolio`)
                }
              >
                personal Report
              </Button>
              <Button
                // FIX: Ensure absolute path with leading slash
                onClick={() => router.push(`/${tenant}/student/resume`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Certificate Type</label>
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

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium">Verification Link</label>
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

      {/* Carousel Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Verified Certificates</h2>
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-5 lg:-left-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="flex-shrink-0 w-80 snap-center hover:shadow-lg transition-shadow"
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
                        className="text-primary hover:underline block truncate"
                      >
                        View Certificate →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-40 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No verified certificates yet. Add one to get started!</p>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-5 lg:-right-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-2 rounded-full shadow-md"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </>
  );
}
