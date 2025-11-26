"use client";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

export default function UploadForm({ collegeCode = "MY_COLLEGE_CODE" }) {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    if (!file) return setErr("Select a file");
    setLoading(true);
    setErr(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("role", "STUDENT");
      form.append("body", collegeCode);

      const res = await fetchWithAuth(
        "http://127.0.0.1:8000/create-bulk-profiles",
        {
          method: "POST",
          body: form,
        }
      );

      setResult(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-bold mb-3">Bulk Upload Students</h3>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-3 block"
        >
          {loading ? "Uploading…" : "Upload"}
        </button>

        {err && <p className="text-red-500 mt-2">{err}</p>}
        {result && (
          <pre className="mt-3 p-3 bg-gray-100 rounded text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
      <div>
        <h2> Students under institution</h2>
      </div>
    </>
  );
}
