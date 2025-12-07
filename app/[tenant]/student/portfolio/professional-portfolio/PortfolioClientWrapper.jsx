"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SideBar from "./sideBar";
import AuroraDark from "@/components/portfolio/templates/AuroraDark";
import { Minimize2 } from "lucide-react";

export default function PortfolioClientWrapper({ user }) {
  const router = useRouter();
  const params = useParams();
  const [viewMode, setViewMode] = useState('windowed'); // 'windowed' | 'fullscreen'
  const [template, setTemplate] = useState('modern'); // 'modern' | 'minimal'
  const [showJobModal, setShowJobModal] = useState(false);

  const authUser = user; //it has { id: 0,  email: "user@example.com",username: "string",first_name: "string",last_name: "string",role: "ADMIN",profile_picture: "string",profile:"string"}
  const onBack = () => {
    // Navigate back to student dashboard
    router.push(`/${params.tenant}/student/dashboard`);
  };

  const handleCopyLink = () => {
    // Placeholder implementation
    alert("Public link copied to clipboard!"); 
  };

  const handleSave = () => {
    // Placeholder implementation
    alert("Changes saved!");
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative">
      {/* SideBar */}
      <SideBar 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onBack={onBack}
        setShowJobModal={setShowJobModal}
        template={template}
        setTemplate={setTemplate}
        handleCopyLink={handleCopyLink}
        handleSave={handleSave}
        user={authUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-y-auto custom-scrollbar">
          
          {/* Fullscreen Exit Button */}
          {viewMode === 'fullscreen' && (
              <button 
                  onClick={() => setViewMode('windowed')}
                  className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                  title="Exit Fullscreen"
              >
                  <Minimize2 size={20} />
              </button>
          )}

          {/* Render Selected Template */}
          {template === 'modern' ? (
              <AuroraDark user={authUser}/>
          ) : (
              <div className="min-h-screen flex items-center justify-center text-gray-500">
                  <div className="text-center">
                      <p className="text-xl font-bold mb-2">Minimal Template</p>
                      <p className="text-sm">Coming Soon...</p>
                  </div>
              </div>
          )}
      </div>

      {/* Job Import Modal (Placeholder) */}
      {showJobModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold text-white mb-4">Import Job Description</h2>
                  <p className="text-gray-400 mb-6 text-sm">Paste a job description to tailor your portfolio automatically.</p>
                  <textarea className="w-full h-32 bg-black border border-gray-700 rounded-lg p-3 text-gray-300 text-sm mb-4 focus:outline-none focus:border-blue-500" placeholder="Paste JD here..."></textarea>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowJobModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                      <button onClick={() => setShowJobModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Analyze & Tailor</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
