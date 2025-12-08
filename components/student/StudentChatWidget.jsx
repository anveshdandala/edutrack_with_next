"use client";

import { useEffect, useState } from "react";
import ChatInterface from "@/components/student/ChatInterface"; // Update path if needed

// Default fallback in case no resume exists yet
const DEFAULT_PROFILE = {
  name: "Student",
  role: "Student",
  skills: [],
  experience: []
};

export default function StudentChatWidget({ tenant }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeContext = async () => {
      try {
        // 1. Get the ID from LocalStorage (Saved during generation)
        // Using the same key pattern you used in JobInputForm
        const currentId = typeof window !== "undefined" 
          ? localStorage.getItem(`current_resume_id_${tenant}`) 
          : null;

        if (!currentId) {
          console.log("No active resume ID found in storage.");
          setResumeData(DEFAULT_PROFILE);
          setLoading(false);
          return;
        }

        // 2. Fetch the Resume Data
        const res = await fetch(`/api/resume/resume/${currentId}/?tenant=${tenant}`);

        if (res.ok) {
          const serverData = await res.json();
          
          // 3. Extract tailored content (The logic you provided)
          const content = serverData.tailored_content || serverData;
          
          console.log("ChatBot Context Loaded:", content);
          setResumeData(content);
        } else {
          console.error("Failed to fetch resume for chat context");
          setResumeData(DEFAULT_PROFILE);
        }
      } catch (error) {
        console.error("Error loading chat context:", error);
        setResumeData(DEFAULT_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeContext();
  }, [tenant]);

  // Optional: Don't show chat until we know context, or show with default
  if (loading) return null; 

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      {/* We pass the fetched resume data as the 'studentProfile' 
          The ChatInterface internally needs to handle this structure 
      */}
      <ChatInterface 
        studentProfile={resumeData || DEFAULT_PROFILE} 
        tenant={tenant}
      />
    </div>
  );
}