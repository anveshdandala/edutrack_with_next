import { GoogleGenAI } from "@google/genai";
import {
  GEMINI_MODEL,
  SYSTEM_INSTRUCTION,
} from "@/components/student/constants";

// Initialize the client
// NOTE: In a production Next.js app, this key would come from NEXT_PUBLIC_API_KEY or a proxy server.
// For this demo, we use process.env.API_KEY as strictly requested.
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });

const Role = {
  USER: "user",
  MODEL: "model",
};
/**
 * Transforms our internal ChatMessage format to the SDK's Content format.
 */
const mapMessagesToContent = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === Role.USER ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
};

/**
 * Initializes a chat session with history and system instructions.
 */
export const createChatSession = (history, profile) => {
  // We embed the profile into the system instruction so the model is context-aware.
  const personalizedSystemInstruction = `
    ${SYSTEM_INSTRUCTION}
    
    CURRENT STUDENT PROFILE:
    ${JSON.stringify(profile, null, 2)}
  `;

  return ai.chats.create({
    model: GEMINI_MODEL,
    history: mapMessagesToContent(history),
    config: {
      systemInstruction: personalizedSystemInstruction,
      temperature: 0.7, // Balanced creativity and precision
    },
  });
};

/**
 * Sends a message to the model and returns the text response.
 */
export const sendMessageToGemini = async (chat, message) => {
  try {
    const response = await chat.sendMessage({ message });
    return (
      response.text ||
      "I'm sorry, I couldn't generate a roadmap step right now."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a connection error. Please try again in a moment.";
  }
};

/**
 * Generates a one-time summary of the student's profile and trajectory.
 */
export const generateProfileSummary = async (profile) => {
  try {
    const prompt = `
      You are an academic advisor. Analyze the following student profile and provide a concise summary (max 3 sentences).
      
      Structure the summary to:
      1. Highlight their key technical strength.
      2. Comment on their current "flow" or career trajectory (e.g., "The student is heavily leaning towards Frontend development...").
      3. Point out one high-level area to focus on next.

      PROFILE:
      ${JSON.stringify(profile, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Summary generation error:", error);
    return "Unable to generate profile summary at this time.";
  }
};
