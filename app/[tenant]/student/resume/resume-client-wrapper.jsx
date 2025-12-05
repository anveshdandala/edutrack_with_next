"use client";

import { useState } from "react";
import JobInputForm from "@/components/resume/JobInputForm";
import ResumeBuilder from "@/components/resume/ResumeBuilder"; // Your existing builder
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import resumeDefaultData from "@/components/resume/resumeDefaultData";
export default function ResumeClientWrapper({ tenant }) {
  // Steps: 'input' -> 'editor'
  const [step, setStep] = useState("input");
  const [resumeData, setResumeData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Called when JobInputForm successfully gets data from backend
  const handleGenerationSuccess = (aiData) => {
    // aiData is the JSON structure you showed me
    setResumeData(aiData);
    setStep("editor");
  };

  // Called when user clicks "Save" inside the editor
  const handleSave = async (currentData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/resume/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailored_content: currentData, // Matches your backend serializer
          template_style: "MODERN", // You might want to pass settings.template here
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for Editor Mode */}
      {step === "editor" && (
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50">
          <Button
            variant="ghost"
            onClick={() => setStep("input")}
            className="text-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> New Analysis
          </Button>
          <div className="font-semibold text-gray-800">Resume Editor</div>
          <Button onClick={() => handleSave(resumeData)} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      <div className="w-full">
        {step === "input" ? (
          <JobInputForm
            onGenerateSuccess={handleGenerationSuccess}
            tenant={tenant}
          />
        ) : (
          /* Render the Builder with the AI Data */
          <ResumeBuilder
            initialData={resumeDefaultData} //........................................change this
            // Important: We pass a key to force re-render if data changes
            key={JSON.stringify(resumeData)}
            // Optional: Pass handleSave down if you want the save button INSIDE the builder
            onSaveExternal={handleSave}
          />
        )}
      </div>
    </div>
  );
}
