"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; 
import JobInputForm from "@/components/resume/JobInputForm";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";
// 1. IMPORT YOUR CHAT INTERFACE
import ChatInterface from "@/components/chat/ChatInterface"; // Check your path

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

  // ... (Your existing useEffect logic for INITIAL LOAD remains exactly the same) ...
  useEffect(() => {
    if (!tenant) return;
    const initializeData = async () => {
      let currentId = null;
      if (typeof window !== "undefined") {
        currentId = localStorage.getItem(ID_KEY);
        const localContent = localStorage.getItem(DATA_KEY);
        if (localContent) {
           try {
             setResumeData(JSON.parse(localContent));
             setStep("editor");
           } catch(e) { console.error(e); }
        }
      }
      if (!currentId) {
        setStep("input");
        return;
      }
      setResumeId(currentId);
      try {
        const res = await fetch(`/api/resume/resume/${currentId}/?tenant=${tenant}`);
        if (res.ok) {
          const serverData = await res.json();
          // Ensure we get the tailored object
          const content = serverData.tailored_content || serverData; 
          setResumeData(content);
          localStorage.setItem(DATA_KEY, JSON.stringify(content));
          setStep("editor");
        } else if (res.status === 404) {
            localStorage.removeItem(ID_KEY);
            setStep("input");
        }
      } catch (error) { console.error(error); }
    };
    initializeData();
  }, [tenant]);

  // ... (Your handleDataChange and handleSave logic remains the same) ...
  const handleDataChange = useCallback((newData) => {
    setResumeData(newData);
    localStorage.setItem(DATA_KEY, JSON.stringify(newData));
  }, [DATA_KEY]);

  const handleSave = async (currentData) => {
    // ... your existing save logic
  };

  const handleReset = () => {
     // ... your existing reset logic
  };

  // --- RENDER LOGIC ---

  if (step === "loading") {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* CASE 1: INPUT FORM (No resume data yet) */}
      {step === "input" && (
         <JobInputForm tenant={tenant} />
      )}

      {/* CASE 2: RESUME EDITOR (Resume data exists) */}
      {step === "editor" && resumeData && (
        <>
          {/* Top Bar / Navigation */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <Button variant="ghost" onClick={() => router.push(`/${tenant}/student`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
             {/* Add your Save/Download buttons here if needed */}
          </div>

          {/* The Actual Resume Builder */}
          <ResumeBuilder 
             initialData={resumeData}
             onUpdate={handleDataChange}
             onSave={() => handleSave(resumeData)}
             isSaving={isSaving}
          />

          {/* --- CHATBOT INTEGRATION --- */}
          <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
            <ChatInterface 
              // PASS THE RESUME DATA DIRECTLY
              // We use 'resumeData' because that holds the tailored content from backend/localstorage
              studentProfile={resumeData} 
            />
          </div>
        </>
      )}
    </div>
  );
}