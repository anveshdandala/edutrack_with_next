"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateDepartment({ onCreated } = {}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Department name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(
        "http://127.0.0.1:8000/create-department", // adjust backend path if needed
        {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            description: description,
          }),
        }
      );

      // fetchWithAuth returns parsed JSON or throws
      setSuccess("Department created successfully.");
      setName("");
      setDescription("");
      if (typeof onCreated === "function") onCreated(res);
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Department Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Computer Science"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=" Brief description about the department"
          className="w-full border rounded px-3 py-2 min-h-[80px] resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create Department"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName("");
            setDescription("");
            setError(null);
            setSuccess(null);
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
