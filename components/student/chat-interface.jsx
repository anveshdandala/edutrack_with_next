import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Trash2, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { CHAT_STORAGE_KEY } from "./constants";
import { createChatSession, sendMessageToGemini } from "@/services/gemini";
export const ChatInterface = ({ studentProfile }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const Role = {
    USER: "user",
    MODEL: "model",
  };
  // We keep the chat session instance in a ref so it persists across re-renders without recreation
  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(CHAT_STORAGE_KEY);
    let initialMessages = [];

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        initialMessages = parsed.messages || [];
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    setMessages(initialMessages);

    // Initialize the Gemini Chat Session with the loaded history
    // We do this inside the effect to ensure it only happens once on mount
    chatSessionRef.current = createChatSession(initialMessages, studentProfile);

    // Scroll to bottom
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({
          lastUpdated: Date.now(),
          messages,
        })
      );
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText("");

    const newUserMsg = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userText,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        // Fallback re-init if something went wrong, though unlikely
        chatSessionRef.current = createChatSession(messages, studentProfile);
      }

      const responseText = await sendMessageToGemini(
        chatSessionRef.current,
        userText
      );

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (
      confirm(
        "Are you sure you want to clear your roadmap history? This cannot be undone."
      )
    ) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      setMessages([]);
      // Re-initialize session with empty history
      chatSessionRef.current = ([], studentProfile);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden ${
        isExpanded ? "h-[600px]" : "h-[60px]"
      }`}
    >
      {/* Header */}
      <div
        className="bg-blue-600 p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Pathfinder AI</h3>
            <p className="text-blue-100 text-xs">
              {isExpanded ? "Your Personal Career Mentor" : "Click to expand"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && messages.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearHistory();
              }}
              className="p-2 hover:bg-white/10 rounded-full text-blue-100 transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center mt-10 p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-slate-800 font-semibold">
                  Hello, {studentProfile.name}!
                </h4>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  I've analyzed your profile. I can help you find projects to
                  fill your gaps or suggest certifications. Ask me anything!
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === Role.USER ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                  max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                  ${
                    msg.role === Role.USER
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                  }
                `}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-2 opacity-70 ${
                      msg.role === Role.USER
                        ? "text-blue-200"
                        : "text-slate-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">
                    Analyzing roadmap...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your career roadmap..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className={`
                  p-3 rounded-xl flex items-center justify-center transition-all
                  ${
                    isLoading || !inputText.trim()
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
