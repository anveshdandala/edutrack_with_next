"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, FileText, ExternalLink, CheckCircle2, 
  Clock, ShieldAlert, Award, Download, Search, Filter, X, Sparkles, UserCheck 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CertificateList({ tenant }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch(`/api/get-certificates?tenant=${tenant}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        
        const data = await res.json();
        const results = Array.isArray(data) ? data : data?.results || [];
        setCertificates(results);
      } catch (err) {
        console.error("Failed to load certificates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (tenant) fetchCertificates();
  }, [tenant]);

  // --- Styles Helper ---
  const getStatusConfig = (status) => {
    switch (status) {
      case "MANUAL_VERIFIED":
        return { 
          borderColor: "border-l-emerald-500",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200", 
          icon: CheckCircle2, 
          label: "Verified by Mentor" 
        };
      
      case "AI_VERIFIED":
        return { 
          borderColor: "border-l-blue-500",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200", 
          icon: Sparkles, 
          label: "AI Verified" 
        };

      case "NEEDS_REVIEW":
        return { 
          borderColor: "border-l-orange-400",
          badgeBg: "bg-orange-50 text-orange-700 border-orange-200", 
          icon: UserCheck, 
          label: "Needs Mentor Review" 
        };

      case "PENDING":
        return { 
          borderColor: "border-l-gray-400",
          badgeBg: "bg-gray-100 text-gray-700 border-gray-200", 
          icon: Clock, 
          label: "AI Processing..." 
        };

      case "REJECTED":
        return { 
          borderColor: "border-l-red-500",
          badgeBg: "bg-red-50 text-red-700 border-red-200", 
          icon: ShieldAlert, 
          label: "Rejected" 
        };

      default:
        return { 
          borderColor: "border-l-gray-300",
          badgeBg: "bg-gray-100 text-gray-700 border-gray-200", 
          icon: FileText, 
          label: status || "Unknown" 
        };
    }
  };

  // --- Derived Data (Stats & Filtering) ---
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      // 1. Search Logic
      const matchesSearch = 
        cert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuing_organization?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Filter Logic
      let matchesStatus = true;
      if (statusFilter === "VERIFIED") {
        matchesStatus = cert.status === "MANUAL_VERIFIED" || cert.status === "AI_VERIFIED";
      } else if (statusFilter === "IN_PROGRESS") {
        matchesStatus = cert.status === "PENDING" || cert.status === "NEEDS_REVIEW";
      } else if (statusFilter === "REJECTED") {
        matchesStatus = cert.status === "REJECTED";
      }

      return matchesSearch && matchesStatus;
    });
  }, [certificates, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: certificates.length,
      verified: certificates.filter(c => c.status === 'MANUAL_VERIFIED' || c.status === 'AI_VERIFIED').length,
      pending: certificates.filter(c => c.status === 'PENDING' || c.status === 'NEEDS_REVIEW').length
    };
  }, [certificates]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      
      {/* 1. Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Uploads</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 uppercase">Verified</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.verified}</p>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm">
            <p className="text-xs font-medium text-amber-600 uppercase">In Progress</p>
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
      </div>

      {/* 2. Toolbar (Search & Filter) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-1 rounded-lg">
         {/* Tabs Filter */}
         <Tabs defaultValue="ALL" className="w-full sm:w-auto" onValueChange={setStatusFilter}>
            <TabsList className="grid w-full grid-cols-4 sm:w-[400px]">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="VERIFIED">Verified</TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search certificates..." 
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
               <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X size={14} />
               </button>
            )}
          </div>
      </div>

      {/* 3. The Grid List */}
      {filteredCertificates.length === 0 ? (
        <EmptyState query={searchQuery} filter={statusFilter} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
          {filteredCertificates.map((cert) => {
            const config = getStatusConfig(cert.status);
            const StatusIcon = config.icon;

            return (
              <Card 
                key={cert.id} 
                className={`group hover:shadow-lg transition-all duration-200 border-l-4 ${config.borderColor} overflow-hidden`}
              >
                <CardContent className="p-5 flex flex-col h-full gap-4">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 border ${config.badgeBg}`}>
                      <StatusIcon size={12} />
                      {config.label}
                    </div>
                    {cert.issuing_organization && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <Award size={12} />
                        <span className="truncate max-w-[120px]">{cert.issuing_organization}</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 line-clamp-1" title={cert.title}>
                      {cert.title || "Untitled Document"}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {cert.category && <span>{cert.category}</span>}
                      {cert.category && cert.level && <span>•</span>}
                      {cert.level && <span>{cert.level}</span>}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {cert.ai_summary ? (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        <span className="font-semibold text-slate-800">AI Summary: </span> 
                        {cert.ai_summary}
                      </p>
                    </div>
                  ) : (
                     <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 flex items-center justify-center h-[74px]">
                        <span className="text-xs text-gray-400 italic">Processing AI Summary...</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-2 flex gap-3">
                    <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-medium text-gray-700" asChild>
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                        <Download size={14} className="mr-2" /> View File
                      </a>
                    </Button>
                    {cert.verification_url && (
                      <Button size="sm" variant="secondary" className="flex-1 h-9 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100" asChild>
                        <a href={cert.verification_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} className="mr-2" /> Verify
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function EmptyState({ query, filter }) {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-xl bg-gray-50/50">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Filter className="text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900">No Certificates Found</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
        {query 
          ? `No results found for "${query}"` 
          : filter !== 'ALL' 
            ? `You don't have any certificates matching the "${filter.toLowerCase().replace('_', ' ')}" filter.`
            : "Upload your certificates to get started."}
      </p>
      {(query || filter !== 'ALL') && (
         <Button variant="link" onClick={() => window.location.reload()} className="mt-2 text-blue-600">
            Clear Filters
         </Button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
       </div>
       <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[240px] w-full rounded-xl" />
          <Skeleton className="h-[240px] w-full rounded-xl" />
       </div>
    </div>
  );
}

function ErrorState() { 
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>Could not retrieve certificates. Please refresh or try again later.</AlertDescription>
      </Alert>
    )
}