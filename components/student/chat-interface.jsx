import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  RefreshCw,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { createChatSession, sendMessageToGemini } from "@/services/gemini";
export const ChatInterface = ({ studentProfile }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const Role = {
    USER: "user",
    MODEL: "model",
  };
  // We keep the chat session instance in a ref so it persists across re-renders
  // This maintains the "session memory" while the user is on the page.
  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize the Gemini Chat Session on mount (fresh session every time page loads)
  useEffect(() => {
    chatSessionRef.current = createChatSession([], studentProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
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
        // Fallback re-init
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

  const handleResetChat = () => {
    // Reset the UI state
    setMessages([]);
    // Create a brand new session with Gemini (clearing the bot's memory of this convo)
    chatSessionRef.current = createChatSession([], studentProfile);
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
            <p className="text-indigo-100 text-xs">
              {isExpanded ? "Session Active" : "Click to expand"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && messages.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetChat();
              }}
              className="p-2 hover:bg-white/10 rounded-full text-indigo-100 transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
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
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-slate-800 font-semibold">
                  Hello, {studentProfile.name}!
                </h4>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                  I'm ready to help with your roadmap. I have your current
                  project and certificate details loaded.
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
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                  }
                `}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-2 opacity-70 ${
                      msg.role === Role.USER
                        ? "text-indigo-200"
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
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
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
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
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
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
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
