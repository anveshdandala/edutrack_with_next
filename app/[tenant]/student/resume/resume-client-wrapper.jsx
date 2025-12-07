"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; 
import JobInputForm from "@/components/resume/JobInputForm";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";
import resumeDefaultData from "@/components/resume/resumeDefaultData";

export default function ResumeClientWrapper() {
  const params = useParams();
  const router = useRouter();
  const tenant = params.tenant;
  
  // Keys for LocalStorage
  const ID_KEY = `current_resume_id_${tenant}`;
  const DATA_KEY = `resume_data_${tenant}`;

  const [step, setStep] = useState("loading");
  const [resumeData, setResumeData] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // 1. INITIAL LOAD
  useEffect(() => {
    if (!tenant) return;

    const initializeData = async () => {
      let currentId = null;

      // A. Check Local Storage for ID
      if (typeof window !== "undefined") {
        currentId = localStorage.getItem(ID_KEY);
        const localContent = localStorage.getItem(DATA_KEY);
        
        // Optimistic Load: If we have content, show it immediately
        if (localContent) {
           try {
             console.log("Loading Optimistic Data from LS:", localContent?.slice(0, 100) + "...");
             setResumeData(JSON.parse(localContent));
             setStep("editor");
           } catch(e) { console.error("Error parsing optimistic data:", e); }
        } else {
             console.log("No Optimistic Data found in LS");
        }
      }

      // If no ID, go back to input
      if (!currentId) {
        setStep("input");
        return;
      }

      setResumeId(currentId);

      // B. Fetch Latest from Server using the ID
      // Endpoint: GET /resume/resume/{resume_id}/
      try {
        const res = await fetch(`/api/resume/resume/${currentId}/?tenant=${tenant}`);
        
        if (res.ok) {
          const serverData = await res.json();
          // Assuming server returns { id: 123, tailored_content: {...} }
          // Adjust 'tailored_content' based on your actual API response structure
          const content = serverData.tailored_content || serverData; 
          
          setResumeData(content);
          // Sync local storage
          localStorage.setItem(DATA_KEY, JSON.stringify(content));
          setStep("editor");
        } else {
            console.error("Failed to fetch resume from server");
            // Optionally handle 404 (resume deleted) by clearing local storage
            if (res.status === 404) {
                localStorage.removeItem(ID_KEY);
                setStep("input");
            }
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };

    initializeData();
  }, [tenant]);

  // 2. AUTO-SAVE LOCAL
  const handleDataChange = useCallback((newData) => {
    setResumeData(newData);
    localStorage.setItem(DATA_KEY, JSON.stringify(newData));
    setLastSaved(new Date());
  }, [DATA_KEY]);

  // 3. SERVER SAVE
  const handleSave = async (currentData) => {
    if (!resumeId) return;
    setIsSaving(true);
    
    // Optimistic Local Save
    localStorage.setItem(DATA_KEY, JSON.stringify(currentData));

    try {
      // Endpoint: PUT /resume/update/
      // Since URL doesn't have ID, we MUST pass it in the body
      const res = await fetch(`/api/resume/update/?tenant=${tenant}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId, // Include ID here
          tailored_content: currentData,
          template_style: "MODERN",
        }),
      });

      if (res.ok) {
        console.log("✅ Saved to server");
      } else {
        const err = await res.json();
        alert(`Save failed: ${err.detail || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Data saved locally only.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if(confirm("Start a new resume? This will clear your current editor session.")) {
      localStorage.removeItem(ID_KEY);
      localStorage.removeItem(DATA_KEY);
      setResumeData(null);
      setStep("input");
    }
  }

  if (step === "loading") {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {step === "editor" && (
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={handleReset} className="text-gray-600 hover:text-red-600 hover:bg-red-50">
                <ArrowLeft className="mr-2 h-4 w-4" /> New Resume
             </Button>
             {lastSaved && (
                 <span className="text-xs text-green-600 flex items-center gap-1 animate-pulse">
                    <CheckCircle2 size={12} /> Saved locally
                 </span>
             )}
          </div>
          
          <div className="font-semibold text-gray-800">Resume Editor</div>
          
          <Button 
            onClick={() => handleSave(resumeData)} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Syncing..." : "Save to Cloud"}
          </Button>
        </div>
      )}

      <div className="w-full">
        {step === "input" ? (
          <JobInputForm tenant={tenant} />
        ) : (
          <ResumeBuilder
            initialData={resumeData || resumeDefaultData}
            key={`builder-${resumeId}`} // Re-mount if ID changes
            onSaveExternal={handleSave} 
            onDataChange={handleDataChange} 
          />
        )}
      </div>
    </div>
  );
}