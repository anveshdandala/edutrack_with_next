"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, RefreshCw } from "lucide-react";

export default function DepartmentManager() {
  const params = useParams();
  const tenant = params?.tenant;

  // --- State ---
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  
  // Loading states
  const [creating, setCreating] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  
  // Data & Feedback
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const isCreated = Boolean(success);

  // --- 1. Fetch Departments Function ---
  const fetchDepartments = useCallback(async () => {
    if (!tenant) return;
    setLoadingList(true);
    try {
      // Calls the Next.js Proxy we created earlier
      const res = await fetch(`/api/admin/departments?tenant=${tenant}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        // Handle case where API returns null or undefined
        setDepartments(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch departments");
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoadingList(false);
    }
  }, [tenant]);

  // --- 2. Load on Mount ---
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // --- 3. Create Department Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCreating(true);

    try {
      const response = await fetch(`/api/admin/departments/create?tenant=${tenant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create department");
      }

      setSuccess("Department created successfully");
      setName("");
      setCode("");
      
      // Refresh the list immediately after creation
      fetchDepartments();

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
        <p className="text-muted-foreground mt-2">
          Configure the academic departments for your institution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: CREATE FORM --- */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Add New Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Department Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Department Code
                </label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CSE"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                  {success}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={creating || isCreated}
                  className={`flex-1 ${
                    isCreated ? "bg-emerald-600 hover:bg-emerald-700" : ""
                  }`}
                >
                  {creating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : isCreated ? (
                    "Created ✓"
                  ) : (
                    "Create Department"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName("");
                    setCode("");
                    setError(null);
                    setSuccess("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: EXISTING LIST --- */}
        <div className="md:col-span-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Existing Departments</CardTitle>
                <CardDescription>
                  List of all active departments.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={fetchDepartments} disabled={loadingList}>
                <RefreshCw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {loadingList ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p className="text-sm">Loading departments...</p>
                </div>
              ) : departments.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg bg-gray-50/50">
                  <Building2 className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-muted-foreground text-sm">No departments found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {dept.code ? dept.code.substring(0, 2).toUpperCase() : "DP"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {dept.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {dept.id}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="font-mono">
                        {dept.code}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}