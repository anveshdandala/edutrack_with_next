// D:\nah\SIH\newshi\app\[tenant]\admin\students\student-client.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, Pencil, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentClient({ initialStudents = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Get Tenant for the "Upload" link
  const params = useParams();
  const tenant = params?.tenant;

  // 2. Client-Side Filtering (Instant)
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return initialStudents;

    const lowerQuery = searchQuery.toLowerCase();

    return initialStudents.filter((s) => {
      // Safe filtering for mixed types (strings and numbers)
      const rollMatch = s.roll_number
        ?.toString()
        .toLowerCase()
        .includes(lowerQuery);
      const batchMatch = s.batch_year?.toString().includes(lowerQuery);
      const semMatch = s.current_semester?.toString().includes(lowerQuery);
      const deptMatch = s.department?.toString().includes(lowerQuery);

      return rollMatch || batchMatch || semMatch || deptMatch;
    });
  }, [searchQuery, initialStudents]);

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Student Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {initialStudents.length} Total Students
          </p>
        </div>

        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roll no, batch..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dynamic Upload Link */}
          <Link href={`/${tenant}/admin/students/upload`}>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-lg flex-1 overflow-hidden flex flex-col">
        {filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No students found.</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Roll Number
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Batch Year
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Semester
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Department ID
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.roll_number || student.id}
                    className="bg-background hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-foreground whitespace-nowrap">
                      {student.roll_number}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {student.batch_year}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {student.current_semester}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {student.department}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="View Insights"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Edit Details"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
