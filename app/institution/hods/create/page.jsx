"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTenant } from "@/components/tenant/TenantProvider";

export default function CreateHodPage() {
  // 1. Matched state perfectly to the Swagger schema
  const [form, setForm] = useState({
    user: {
      email: "",
      password: "",
    },
    department: "",
    employee_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const tenant = useTenant();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/administration/departments`);
        if (res.ok) {
          const data = await res.json();
          setDepartments(Array.isArray(data) ? data : data.results || []);
        } else {
          console.error("Failed to load departments");
        }
      } catch (e) {
        console.error("Error fetching departments:", e);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, []);

  // 2. Created specific handlers for nested vs flat state
  const handleUserChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      user: { ...prev.user, [field]: value },
    }));
  };

  const handleFlatChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/profiles/hods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.error || errData.detail || "Failed to create HOD",
        );
      }

      setSuccess("HOD created successfully!");
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* 3. Replaced bg-white with bg-card, border-gray with border-border */}
      <div className="max-w-2xl mx-auto bg-card text-card-foreground rounded-lg border border-border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Create HOD</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Create a new Head of Department and assign their credentials.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input
                type="email"
                placeholder="hod@college.edu"
                value={form.user.email}
                onChange={(e) => handleUserChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="Temporary password"
                value={form.user.password}
                onChange={(e) => handleUserChange("password", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* 4. Added Employee ID Field */}
              <label className="block text-sm font-medium mb-1.5">
                Employee ID
              </label>
              <Input
                type="text"
                placeholder="e.g. EMP-2024-01"
                value={form.employee_id}
                onChange={(e) =>
                  handleFlatChange("employee_id", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Department
              </label>
              <Select
                value={form.department}
                onValueChange={(value) => handleFlatChange("department", value)}
                disabled={loadingDepts}
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingDepts ? "Loading..." : "Select department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name} - {dept.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. Theme-aware alert boxes */}
          {error && (
            <div className="p-3 text-sm rounded border bg-destructive/10 border-destructive/20 text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm rounded border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              {success}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create HOD"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setForm({
                  user: { email: "", password: "" },
                  department: "",
                  employee_id: "",
                })
              }
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
