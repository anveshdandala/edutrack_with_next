import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Creates a new chat session with Gemini
 * @param {Array} history - Previous conversation history
 * @param {Object} studentProfile - Student profile data for context
 * @returns {Object} Chat session instance
 */
export function createChatSession(history = [], studentProfile = {}) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build system context from student profile
    const systemContext = buildSystemContext(studentProfile);

    // Convert history to Gemini format
    const formattedHistory = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
    }));

    // Start chat with context
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemContext }],
            },
            {
                role: "model",
                parts: [{ text: "I understand. I'm ready to help you with your career roadmap and provide personalized guidance based on your profile." }],
            },
            ...formattedHistory,
        ],
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        },
    });

    return chat;
}

/**
 * Sends a message to Gemini and returns the response
 * @param {Object} chatSession - Active chat session
 * @param {string} message - User message
 * @returns {Promise<string>} AI response text
 */
export async function sendMessageToGemini(chatSession, message) {
    try {
        if (!chatSession) {
            throw new Error("Chat session not initialized");
        }

        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error sending message to Gemini:", error);

        // Return user-friendly error messages
        if (error.message?.includes("API_KEY")) {
            return "⚠️ Gemini API key not configured. Please contact your administrator.";
        }

        return "⚠️ I'm having trouble connecting right now. Please try again in a moment.";
    }
}

/**
 * Builds system context from student profile
 * @param {Object} studentProfile - Student profile data
 * @returns {string} Formatted context
 */
function buildSystemContext(studentProfile) {
    const { name, branch, year, projects = [], certificates = [] } = studentProfile;

    let context = `You are Pathfinder AI, a personalized career guidance assistant for ${name || "the student"}.

Student Profile:
- Name: ${name || "N/A"}
- Branch: ${branch || "N/A"}
- Year: ${year || "N/A"}
`;

    if (projects?.length > 0) {
        context += `\nProjects:\n`;
        projects.forEach((project, idx) => {
            context += `  ${idx + 1}. ${project.title || project.name || "Untitled"}: ${project.description || "No description"}\n`;
        });
    }

    if (certificates?.length > 0) {
        context += `\nCertificates:\n`;
        certificates.forEach((cert, idx) => {
            context += `  ${idx + 1}. ${cert.title || cert.name || "Untitled"} (${cert.platform || "Unknown platform"})\n`;
        });
    }

    context += `\nYour role:
- Provide personalized career guidance and roadmap suggestions
- Help the student identify skill gaps and learning paths
- Suggest relevant projects and certifications
- Answer questions about career opportunities in their field
- Be encouraging and supportive

Keep responses concise, actionable, and personalized to their profile.`;

    return context;
}
