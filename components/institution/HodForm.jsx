"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

export default function HodForm({ onCreated }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "HOD",
    department: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    setErr(null);
    try {
      await fetchWithAuth("http://127.0.0.1:8000/create-hod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onCreated?.();
      setForm({
        first_name: "",
        last_name: "",
        role: "HOD",
        department: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="First name"
        value={form.first_name}
        onChange={(e) => setField("first_name", e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="Last name"
        value={form.last_name}
        onChange={(e) => setField("last_name", e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="Department code"
        value={form.department}
        onChange={(e) => setField("department", e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setField("username", e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        className="border p-2 w-full"
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setField("password", e.target.value)}
        className="border p-2 w-full"
      />

      {err && <p className="text-red-500">{err}</p>}

      <button
        onClick={submit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating…" : "Create HOD"}
      </button>
    </div>
  );
}
