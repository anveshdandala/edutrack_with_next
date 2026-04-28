"use client";
import { useState, useEffect, useRef } from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumeEditorClient({ resumeId, tenant,resumeData, baseData }) {
  const router = useRouter();
  const [data, setData] = useState(resumeData || baseData);
  const [isSaving, setIsSaving] = useState(false);
  const latestDataRef = useRef(data);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  const handleDataChange = (newData) => {
    latestDataRef.current = newData;
    sessionStorage.setItem(`resume_draft_${resumeId}`, JSON.stringify(newData));
  };

  const handleSave = async () => {
    const dataToSave = latestDataRef.current;
    if (!dataToSave) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/resume/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resumeId,
          tailored_content: dataToSave,
          template_style: "MODERN",
        }),
      });

      if (res.ok) alert("Resume saved!");
      else alert("Failed to save.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) return <div className="p-10 text-center">Loading Editor...</div>;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-md border bg-background/95 px-4 py-3 backdrop-blur print:hidden">
        <Button variant="ghost" onClick={() => router.push("/student/resume")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="font-semibold text-foreground">Resume Editor</div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="rounded-md border bg-card p-4">
        <ResumeBuilder
          initialData={data}
          key={JSON.stringify(data)}
          onSaveExternal={handleSave}
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
}
