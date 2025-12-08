"use client";
import { useState } from "react";
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

export default function CreateHodPage() {
  const router = useRouter();
  const params = useParams();
  const tenant = params?.tenant;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    department_id: "", // Changed from 'department' to match backend
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // FIX 1: Pass tenant in the URL query string
      const res = await fetch(`/api/admin/hod/create?tenant=${tenant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensure department_id is sent as a number if possible, though JSON is typically forgiving
        body: JSON.stringify({
          ...form,
          department_id: parseInt(form.department_id), // Ensure integer
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || JSON.stringify(data));
      }

      setSuccess("HOD Created Successfully!");
      // Optional: Redirect after success
      // router.push(`/${tenant}/admin/hods`);

      // Reset form
      setForm({
        first_name: "",
        last_name: "",
        department_id: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Create HOD</h1>
        <p className="text-gray-600 text-sm mb-6">
          Create a new Head of Department
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Input
                value={form.first_name}
                onChange={(e) => setField("first_name", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Input
                value={form.last_name}
                onChange={(e) => setField("last_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <Input
                type="department"
                value={form.department_id}
                onChange={(e) => setField("department_id", e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
              {success}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create HOD"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
