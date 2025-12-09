"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/student/chat-interface"; 

const DEFAULT_PROFILE = {
  name: "Student",
  context_type: "EMPTY"
};

export default function StudentChatWidget({ tenant, user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentContext = async () => {
      try {
        // 1. Call our new Proxy
        const res = await fetch(`/api/student/profile-data?tenant=${tenant}`);
        
        if (res.ok) {
            const apiData = await res.json();
            console.log("ChatBot Context Loaded (New Endpoint):", apiData);

            // 2. Map the API response to a structure the Chatbot uses
            // We wrap the raw API response so the prompt can see everything
            const mappedProfile = {
               // Fallback names if not in API response
               name: apiData.full_name || user?.first_name || "Student",
               
               // We pass the entire object from the backend
               full_record: apiData, 
               
               // A flag to tell gemini.js how to handle this
               context_type: "LIVE_STUDENT_DATA" 
            };

            setProfileData(mappedProfile);
        } else {
            console.warn("Failed to fetch profile-data, using default.");
            setProfileData(DEFAULT_PROFILE);
        }

      } catch (error) {
        console.error("Error loading student context:", error);
        setProfileData(DEFAULT_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    if (tenant) fetchStudentContext();
  }, [tenant, user]);

  if (loading) return null; 

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      <ChatInterface
        studentProfile={profileData || DEFAULT_PROFILE}
        tenant={tenant}
      />
    </div>
  );
}