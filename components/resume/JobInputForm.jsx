"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, FileText, Briefcase } from "lucide-react";

export default function JobInputForm({ tenant }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    job_description: "",
    template_style: "MODERN",
  });
  const [loading, setLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for existing ID on load
  useEffect(() => {
    if (typeof window !== "undefined") {
        const existingId = localStorage.getItem(`current_resume_id_${tenant}`);
        if (existingId) setHasDraft(true);
    }
  }, [tenant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the new GENERATE endpoint
      // Note: Ensure your Next.js API route proxies this to your Django backend
      const res = await fetch(`/api/resume/generate/?tenant=${tenant}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            // Add Authorization header if needed here, or handle in proxy
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      // Expecting data like: { id: 123, tailored_content: {...}, portfolio_content: {...} }
      
      console.log("GENERATION SUCCESS:", data);

      if (typeof window !== "undefined") {
        // 2. CRITICAL: Store the ID. This is our key to the backend.
        console.log("Saving ID to LS:", `current_resume_id_${tenant}`, data.id);
        localStorage.setItem(`current_resume_id_${tenant}`, data.id);
        
        // 3. Store content for instant load (Optimistic UI)
        console.log("Saving Content to LS:", `resume_data_${tenant}`, data.tailored_content);
        localStorage.setItem(`resume_data_${tenant}`, JSON.stringify(data.tailored_content));
      }

      // 4. Navigate
      router.push(`/${tenant}/student/resume/edit`);

    } catch (err) {
      console.error(err);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
      router.push(`/${tenant}/student/resume/edit`);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2">
          <Sparkles className="text-blue-600" /> AI Resume Tailor
        </h1>
        <p className="text-gray-500">
          Paste the Job Description below to generate a new targeted resume.
        </p>
      </div>

      {hasDraft && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <div>
                    <h3 className="font-semibold text-blue-900">Active Resume Found</h3>
                    <p className="text-sm text-blue-700">Continue editing your last generated resume?</p>
                </div>
            </div>
            <Button onClick={handleContinue} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Continue Editing
            </Button>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Target Job Title</label>
            <Input
              required
              placeholder="e.g. Senior Python Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-12 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea
              required
              className="w-full min-h-[200px] p-4 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste JD here..."
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
            {loading ? <><Loader2 className="mr-2 animate-spin" /> Generating...</> : "Generate & Edit"}
          </Button>
        </form>
      </div>
    </div>
  );
}