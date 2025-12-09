"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, CheckCircle2, Clock, ShieldAlert, 
  ExternalLink, Download, Check, X, Loader2, Sparkles
} from "lucide-react";

// Updated Helper based on your Backend Model
const getStatusConfig = (status) => {
  switch (status) {
    case "MANUAL_VERIFIED":
      return { badge: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Verified by Mentor" };
    
    case "AI_VERIFIED":
      return { badge: "bg-blue-100 text-blue-700 border-blue-200", icon: Sparkles, label: "AI Verified" };
    
    case "PENDING":
      return { badge: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock, label: "AI Processing" };
    
    case "NEEDS_REVIEW": // Use this for Faculty Approval Queue
      return { badge: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Needs Review" };
    
    case "REJECTED":
      return { badge: "bg-red-100 text-red-700 border-red-200", icon: ShieldAlert, label: "Rejected" };
    
    default:
      return { badge: "bg-gray-50 text-gray-500 border-gray-200", icon: FileText, label: status || "Unknown" };
  }
};

export default function FacultyDashboardUI({ tenant, students, certificates }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState(null);

  const handleVerification = async (certId, newStatus) => {
    setProcessingId(certId);
    try {
      const res = await fetch("/api/verify-certificate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: certId, status: newStatus, tenant }),
      });

      if (!res.ok) throw new Error("Failed to verify");
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ... Header ... */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ... Left Column (Students) ... */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>My Students</span>
                </div>
                <Badge variant="secondary">{students.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-0 px-6 pb-6 space-y-3">
              {students.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No students assigned yet.
                </div>
              ) : (
                students.map((studentObj, index) => {
                  const user = studentObj.user || {};
                  const fullName = user.first_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username || "Unknown";
                  const linkId = user.id || index;

                  return (
                    <Link
                      key={linkId}
                      href={{
                        pathname: `/${tenant}/faculty/analysis/${linkId}`,
                        query: {
                          name: fullName,
                          email: user.email,
                          roll_number: studentObj.roll_number,
                          department: studentObj.department,
                          semester: studentObj.current_semester,
                          batch: studentObj.batch_year
                        }
                      }}
                      className="block group"
                    >
                      <div className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700">
                            {fullName}
                          </h3>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            {studentObj.roll_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                             Sem {studentObj.current_semester}
                           </span>
                           <span>•</span>
                           <span className="truncate max-w-[120px]">
                             {studentObj.department === 0 ? 'CSE' : studentObj.department}
                           </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: CERTIFICATES */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>Submissions</span>
                </CardTitle>
                <Badge variant="outline" className="bg-white">Total: {certificates.length}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>No certificates found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => {
                    const status = getStatusConfig(cert.status);
                    const StatusIcon = status.icon;
                    
                    // Show actions if it Needs Review OR is AI Verified (waiting for final stamp)
                    const showActions = cert.status === "NEEDS_REVIEW" || cert.status === "AI_VERIFIED" || cert.status === "PENDING";
                    
                    return (
                      <div key={cert.id} className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${status.badge}`}>
                             <StatusIcon size={10} /> {status.label}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                           <h4 className="font-bold text-sm text-gray-900 line-clamp-1" title={cert.title}>
                             {cert.title || "Untitled"}
                           </h4>
                           <p className="text-xs text-gray-500 mt-0.5">
                             {cert.issuing_organization || "Unknown Org"}
                           </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-2 border-t border-gray-50 space-y-2">
                           <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" asChild>
                                    <a href={cert.file_url} target="_blank"><Download className="w-3 h-3 mr-1" /> View</a>
                                </Button>
                           </div>

                           {showActions && (
                                <div className="flex gap-2 pt-1">
                                    <Button 
                                        size="sm" 
                                        className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                                        disabled={processingId === cert.id}
                                        onClick={() => handleVerification(cert.id, "MANUAL_VERIFIED")}
                                    >
                                        {processingId === cert.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Check className="w-3 h-3 mr-1" />}
                                        Approve
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        className="flex-1 h-8 text-xs"
                                        disabled={processingId === cert.id}
                                        onClick={() => handleVerification(cert.id, "REJECTED")}
                                    >
                                        Reject
                                    </Button>
                                </div>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}