"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, FileText, Briefcase } from "lucide-react";
import resumeDefaultData from "@/components/resume/resumeDefaultData";

export default function JobInputForm({ tenant }) {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    title: "",
    job_description: "",
    template_style: "MODERN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("DEV MODE: Skipping Generation API, using default data");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // --- REAL API CODE (COMMENTED OUT) ---
      // // Pass tenant as query param
      // const res = await fetch(`/api/resume/generate?tenant=${tenant}`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate resume");
      }

      onGenerateSuccess(data);
      // -----------------------

      const generatedData = resumeDefaultData;

      // 3. Save to Session Storage to pass it to the next page
      // We use sessionStorage so it clears when the tab closes
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "ai_generated_resume",
          JSON.stringify(generatedData)
        );
      }

      // 4. Navigate to the Editor Page
      router.push(`/${tenant}/student/resume/edit`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2">
          <Sparkles className="text-blue-600" /> AI Resume Tailor
        </h1>
        <p className="text-gray-500">
          Paste the Job Description below. Our AI will restructure your profile
          to match the role.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Target Job Title
            </label>
            <Input
              required
              placeholder="e.g. Senior Python Developer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-12 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Job Description
            </label>
            <textarea
              required
              className="w-full min-h-[200px] p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              placeholder="Paste the full JD here..."
              value={formData.job_description}
              onChange={(e) =>
                setFormData({ ...formData, job_description: e.target.value })
              }
            />
          </div>

          {/* Template Style Selector ... (Keep existing code) */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing &
                Generating...
              </>
            ) : (
              "Generate & Edit Resume"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
