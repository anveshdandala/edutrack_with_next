"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function CreateHodPage() {
  const router = useRouter();
  const params = useParams();
  const tenant = params?.tenant;
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    department_id: "", 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Fetch Departments (Correctly passing tenant)
  useEffect(() => {
    async function fetchDepartments() {
      if (!tenant) return;
      try {
        // Call NEXT.JS Proxy, not Django directly
        const res = await fetch(`/api/admin/departments?tenant=${tenant}`);
        
        if (res.ok) {
          const data = await res.json();
          setDepartments(data);
        } else {
          console.error("Failed to load departments");
        }
      } catch (error) {
        console.error("Network error fetching departments", error);
      }
    }
    fetchDepartments();
  }, [tenant]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // POST to create HOD (Ensure you have a proxy for this too, or use the same pattern)
      const res = await fetch(`/api/admin/hod/create?tenant=${tenant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          department_id: parseInt(form.department_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to create HOD");
      }

      setSuccess("HOD Created Successfully!");
      setForm({
        first_name: "", last_name: "", username: "", email: "", password: "", department_id: "",
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex justify-center items-start pt-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Create HOD</h1>
        <p className="text-gray-500 text-sm mb-8">
          Register a new Head of Department.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input
                value={form.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
                required
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input
                value={form.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              placeholder="hod@college.edu"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Department</label>
            <Select
              value={form.department_id}
              onValueChange={(val) => setField("department_id", val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.length === 0 ? (
                   <div className="p-2 text-sm text-gray-500 text-center">Loading...</div>
                ) : (
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      <span className="font-bold mr-2">{dept.code}</span> 
                      <span className="text-gray-500">- {dept.name}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Input
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              🚨 {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
              ✅ {success}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create HOD"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}