"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SideBar from "./sideBar";
import AuroraDark from "@/components/portfolio/templates/AuroraDark";
import { Minimize2 } from "lucide-react";

export default function PortfolioClientWrapper({ user }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('windowed'); // 'windowed' | 'fullscreen'
  const [template, setTemplate] = useState('modern'); // 'modern' | 'minimal'
  const [showJobModal, setShowJobModal] = useState(false);

  const authUser = user; //it has { id: 0,  email: "user@example.com",username: "string",first_name: "string",last_name: "string",role: "ADMIN",profile_picture: "string",profile:"string"}
  const onBack = () => {
    // Navigate back to student dashboard
    router.push(`/student`);
  };

  const handleCopyLink = () => {
    // Placeholder implementation
    alert("Public link copied to clipboard!"); 
  };

  const handleSave = () => {
    // Placeholder implementation
    alert("Changes saved!");
  };

  const previewClassName =
    viewMode === "fullscreen"
      ? "fixed inset-0 z-40 overflow-y-auto bg-background"
      : "min-h-[720px] overflow-hidden rounded-md border bg-background";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Studio</h1>
        <p className="text-sm text-muted-foreground">
          Preview, publish, and tune your student portfolio.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[288px_1fr]">
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

      <div className={previewClassName}>
          
          {/* Fullscreen Exit Button */}
          {viewMode === 'fullscreen' && (
              <button 
                  onClick={() => setViewMode('windowed')}
                  className="fixed right-4 top-4 z-50 rounded-md border bg-background/90 p-2 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent"
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
      </div>

      {/* Job Import Modal (Placeholder) */}
      {showJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-md border bg-card p-6 shadow-xl">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Import Job Description</h2>
                  <p className="mb-6 text-sm text-muted-foreground">Paste a job description to tailor your portfolio automatically.</p>
                  <textarea className="mb-4 h-32 w-full resize-none rounded-md border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Paste JD here..."></textarea>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowJobModal(false)} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">Cancel</button>
                      <button onClick={() => setShowJobModal(false)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Analyze & Tailor</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
