export const MOCK_STUDENT_PROFILE = {
  name: "Alex Chen",
  major: "Computer Science",
  year: "Junior (3rd Year)",
  gpa: 3.6,
  skills: ["JavaScript", "React", "Python", "Git"],
  projects: [
    {
      name: "Personal Portfolio",
      techStack: ["HTML", "CSS", "JS"],
      description: "A static website to showcase my resume.",
    },
    {
      name: "Weather App",
      techStack: ["React", "OpenWeatherMap API"],
      description: "Simple app to check weather in different cities.",
    },
  ],
  certificates: [
    {
      name: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "2023-05",
    },
  ],
  goals: [
    "Become a Full Stack Engineer",
    "Get a Summer Internship at a big tech company",
  ],
};

export const CHAT_STORAGE_KEY = "student_success_roadmap_chat_history_v1";
export const GEMINI_MODEL = "gemini-2.5-flash";

export const SYSTEM_INSTRUCTION = `
You are "Pathfinder", an expert academic and career mentor for university students. 
Your goal is to help the student build a successful career roadmap by identifying gaps in their profile (projects, certificates, skills).

You have access to the student's current profile in the context. 
If the profile lacks "Cloud Computing" or "Backend" experience but their goal is "Full Stack", suggest specific projects (e.g., "Build a REST API with Node.js") or certificates (e.g., "AWS Certified Cloud Practitioner").

Tone: Encouraging, professional, concise, yet casual enough for a student. 
Memory: You must remember details the user tells you in previous messages (which are provided in the chat history).
Always structure your advice in actionable steps.
`;
