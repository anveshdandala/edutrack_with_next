"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { useTenant } from "@/components/tenant/TenantProvider";

export default function JobInputForm() {
  const router = useRouter();
  const tenant = useTenant();
  const [formData, setFormData] = useState({
    title: "",
    job_description: "",
    template_style: "MODERN",
  });
  const [loading, setLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    const existingId = localStorage.getItem(`current_resume_id`);
    if (existingId) {
      setHasDraft(true);
      setDraftId(existingId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      localStorage.setItem("current_resume_id", data.id);
      router.push(`/student/resume/${data.id}/edit`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3 flex justify-center items-center gap-2 text-foreground">
          <Sparkles className="text-primary h-7 w-7" /> AI Resume Tailor
        </h1>
        <p className="text-muted-foreground">
          Paste the job description below to generate a targeted resume.
        </p>
      </div>

      {/* Draft Alert - Uses opacity based primary colors to work in both themes */}
      {hasDraft && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-background rounded-full shadow-sm border border-border">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Draft Found</h3>
              <p className="text-sm text-muted-foreground">
                Continue editing your last resume?
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/student/resume/${draftId}/edit`)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Continue Editing
          </Button>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-sm border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Target Job Title
            </label>
            <Input
              required
              placeholder="e.g. Senior Python Developer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Job Description
            </label>
            {/* Styled to perfectly match Shadcn's <Input> component */}
            <textarea
              required
              className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Paste the full job description here..."
              value={formData.job_description}
              onChange={(e) =>
                setFormData({ ...formData, job_description: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-medium transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
              </>
            ) : (
              "Generate & Edit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
