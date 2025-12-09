"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, Pencil, Upload, Search, AlertCircle, User, FileSpreadsheet } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function StudentClient({ initialStudents = [], initialError = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 1. Get Tenant for links
  const params = useParams();
  const tenant = params?.tenant;

  // 2. Client-Side Filtering
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return initialStudents;

    const lowerQuery = searchQuery.toLowerCase();

    return initialStudents.filter((s) => {
      // Safe filtering for mixed types (strings and numbers)
      const rollMatch = s.roll_number?.toString().toLowerCase().includes(lowerQuery);
      const batchMatch = s.batch_year?.toString().includes(lowerQuery);
      const semMatch = s.current_semester?.toString().includes(lowerQuery);
      const deptMatch = s.department?.toString().toLowerCase().includes(lowerQuery);
      // Optional: If your API returns a nested user object for names
      const nameMatch = s.user 
        ? `${s.user.first_name} ${s.user.last_name}`.toLowerCase().includes(lowerQuery)
        : false;

      return rollMatch || batchMatch || semMatch || deptMatch || nameMatch;
    });
  }, [searchQuery, initialStudents]);

  // --- RENDER ERROR STATE ---
  if (initialError) {
    return (
      <div className="flex flex-col h-full p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Directory</AlertTitle>
          <AlertDescription>{initialError}</AlertDescription>
        </Alert>
        <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry Connection
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Student Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {initialStudents.length} Total Records • {filteredStudents.length} Visible
          </p>
        </div>

        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Upload Link */}
          <Link href={`/${tenant}/admin/students/upload`}>
            <Button className="gap-2 shadow-sm">
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white border border-border rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FileSpreadsheet className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">No students found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
               {initialStudents.length === 0 
                 ? "The directory is empty. Upload a CSV file to add students." 
                 : `No results matching "${searchQuery}". Try a different keyword.`}
            </p>
            {initialStudents.length > 0 && (
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 text-blue-600">
                    Clear Search
                </Button>
            )}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Roll Number</th>
                  <th scope="col" className="px-6 py-4 font-medium">Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Department</th>
                  <th scope="col" className="px-6 py-4 font-medium">Batch</th>
                  <th scope="col" className="px-6 py-4 font-medium">Sem</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                    // Handle cases where student.user might be null or missing
                    const fullName = student.user 
                        ? `${student.user.first_name} ${student.user.last_name}`.trim() || student.user.username
                        : "N/A";
                    
                    return (
                      <tr
                        key={student.roll_number || student.id}
                        className="bg-white hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap font-mono">
                          {student.roll_number}
                        </td>
                        <td className="px-6 py-3 text-gray-600 font-medium">
                          {fullName}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          <Badge variant="secondary" className="font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                             {student.department === 0 ? "General" : student.department}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {student.batch_year}
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {student.current_semester}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                              title="Edit Details"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}