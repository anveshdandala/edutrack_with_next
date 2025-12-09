"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/student/chat-interface"; 

const DEFAULT_PROFILE = {
  name: "Student",
  role: "Student",
  department: "General",
  current_semester: "N/A",
  skills: [], 
  experience: []
};

export default function StudentChatWidget({ tenant, user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentContext = async () => {
      try {
        if (!user || !user.id) {
            console.warn("No user ID provided to ChatWidget");
            setProfileData(DEFAULT_PROFILE);
            return;
        }

        // 1. Fetch Detailed Info via Proxy
        const res = await fetch(`/api/student-details?tenant=${tenant}&id=${user.id}`);
        
        let details = {};
        if (res.ok) {
            details = await res.json();
            console.log("Fetched detailed student info:", details);
        } else {
            console.warn("Could not fetch detailed info, using basic user data.");
        }

        // 2. Map Administrative Data
        const mappedProfile = {
           name: `${user.first_name} ${user.last_name}`.trim() || user.username || "Student",
           role: "Student", 
           details: {
             roll_number: details.roll_number || user.roll_number || "N/A",
             department: details.department_name || details.department || "General", 
             year: details.current_year || user.batch_year || "N/A",
             semester: details.current_semester || user.current_semester || "N/A",
             email: user.email,
             section: details.section || "N/A"
           },
           context_type: "ADMINISTRATIVE_RECORD", 
           skills: [], 
           experience: [] 
        };

        console.log("ChatBot Context Loaded:", mappedProfile);
        setProfileData(mappedProfile);

      } catch (error) {
        console.error("Error loading student context:", error);
        setProfileData(DEFAULT_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    if (tenant && user) fetchStudentContext();
  }, [tenant, user]);

  // Don't render until we have context
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