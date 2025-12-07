"use client";

import { useState, useEffect, useRef } from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumeEditorClient({ tenant, baseData }) {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load data on mount
  useEffect(() => {
    // 1. Try to get AI generated data from previous step
    const storedData = sessionStorage.getItem("ai_generated_resume");

    if (storedData) {
      try {
        setResumeData(JSON.parse(storedData));
        // Optional: Clear it so it doesn't persist forever
        // sessionStorage.removeItem("ai_generated_resume");
      } catch (e) {
        console.error("Failed to parse stored resume data");
        setResumeData(baseData);
      }
    } else {
      // 2. Fallback to server data if no AI generation happened
      setResumeData(baseData);
    }
  }, [baseData]);

  const latestDataRef = useRef(resumeData);

  // Sync ref when initial data loads
  useEffect(() => {
    latestDataRef.current = resumeData;
  }, [resumeData]);

  const handleDataChange = (newData) => {
    // 1. Update the Ref (for the Save button)
    latestDataRef.current = newData;
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ai_generated_resume", JSON.stringify(newData));
    }
    
    console.log("[User Input] Auto-saved to session storage:", newData.name);
  };

  const handleSave = async () => {
    const dataToSave = latestDataRef.current;
    if (!dataToSave) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/resume/update?tenant=${tenant}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailored_content: dataToSave,
          template_style: "MODERN",
        }),
      });

      if (res.ok) {
        alert("Resume saved successfully!");
      } else {
        alert("Failed to save.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving resume.");
    } finally {
      setIsSaving(false);
    }
  };

  // Prevent rendering builder until data is decided (prevents flash)
  if (!resumeData)
    return <div className="p-10 text-center">Loading Editor...</div>;

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${tenant}/student/resume`)}
          className="text-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Generator
        </Button>
        <div className="font-semibold text-gray-800">Resume Editor</div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* The Actual Editor */}
      <ResumeBuilder
        initialData={resumeData}
        key={JSON.stringify(resumeData)} // Force re-render if data changes
        onSaveExternal={handleSave}
        onDataChange={handleDataChange}
      />
    </div>
  );
}
