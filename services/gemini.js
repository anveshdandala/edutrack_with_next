// services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import {
  GEMINI_MODEL,
  SYSTEM_INSTRUCTION, 
} from "@/components/student/constants";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);

const Role = { USER: "user", MODEL: "model" };

const mapMessagesToContent = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === Role.USER ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
};

export const createChatSession = (history, profile) => {
  
  let contextInstruction = "";

  // --- NEW LOGIC FOR THE NEW ENDPOINT ---
  if (profile.context_type === "LIVE_STUDENT_DATA") {
      contextInstruction = `
        CONTEXT: You are chatting with a registered student. You have access to their comprehensive academic and extracurricular record.
        
        STUDENT RECORD (JSON):
        ${JSON.stringify(profile.full_record, null, 2)}
        
        GUIDANCE MODE:
        1. Use the 'gpa', 'attendance', and 'department' to tailor academic advice.
        2. Look at 'certificates', 'internships', or 'projects' in the JSON to suggest career paths.
        3. If specific fields (like 'skills') are empty in the JSON, ask the student about them to build a better roadmap.
      `;
  } 
  // ... Keep existing logic for fallback/resume if you want, or remove ...
  else if (profile.context_type === "ADMINISTRATIVE_RECORD") {
      // (Old logic for basic details)
      contextInstruction = `Student Basic Info: ${JSON.stringify(profile.details)}`;
  } else {
      contextInstruction = `Student Profile: ${JSON.stringify(profile)}`;
  }

  const finalInstruction = `
    ${SYSTEM_INSTRUCTION}
    
    ${contextInstruction}
  `;

  const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: finalInstruction 
  });
  
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