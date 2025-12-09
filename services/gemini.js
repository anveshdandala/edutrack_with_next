// services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- CHANGED IMPORT
import {
  GEMINI_MODEL,
  SYSTEM_INSTRUCTION, 
} from "@/components/student/constants";

// Initialize the client with the Stable SDK class
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);

const Role = { USER: "user", MODEL: "model" };

// Helper to format messages for the SDK
const mapMessagesToContent = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === Role.USER ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
};

export const createChatSession = (history, profile) => {
  
  // 1. Construct Dynamic Context based on Profile Type
  let contextInstruction = "";

  if (profile.context_type === "ADMINISTRATIVE_RECORD") {
      // Logic for Administrative Data (From Student Details API)
      contextInstruction = `
        CONTEXT: You are chatting with a registered student based on their official university record.
        
        STUDENT DETAILS:
        - Name: ${profile.name}
        - Roll No: ${profile.details?.roll_number || "N/A"}
        - Semester: ${profile.details?.semester || "N/A"}
        - Department: ${profile.details?.department || "General"}
        
        GUIDANCE MODE: 
        Since you only have administrative data (not their full resume/skills yet), your goal is to:
        1. Ask them about their interests to fill in the gaps.
        2. Guide them on what electives or paths match their Department/Semester.
        3. Encourage them to upload a resume or certificates to get better advice.
      `;
  } else {
      // Logic for Rich Resume Data
      contextInstruction = `
        CONTEXT: You have the student's full resume and tailored profile.
        
        STUDENT PROFILE:
        ${JSON.stringify(profile, null, 2)}
      `;
  }

  const finalInstruction = `
    ${SYSTEM_INSTRUCTION}
    
    ${contextInstruction}
  `;

  // 2. Initialize Model (Using the correct method for @google/generative-ai)
  const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: finalInstruction 
  });
  
  // 3. Start Chat
  return model.startChat({
    history: mapMessagesToContent(history),
    generationConfig: {
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (chatSession, message) => {
  try {
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the university server. Please try again.";
  }
};