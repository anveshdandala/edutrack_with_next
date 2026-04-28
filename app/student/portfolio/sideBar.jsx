"use client";
import {
  Sparkles,
  Maximize2,
  LayoutTemplate,
  LinkIcon,
  Save,
  ArrowLeft,
  Briefcase,
  CheckCircle2
} from "lucide-react";

export default function SideBar({
    viewMode,
    setViewMode,
    onBack,
    setShowJobModal,
    template,
    setTemplate,
    handleCopyLink,
    handleSave,
    user
}) {
    return (
        <>
            {viewMode === 'windowed' && (
                <aside className="flex h-fit flex-col rounded-md border bg-card">
                    <div className="border-b p-5">
                        <button 
                            onClick={onBack} 
                            className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <Briefcase className="text-primary" size={20}/>
                            Portfolio Studio
                        </h2>
                    </div>

                    <div className="flex-1 space-y-6 p-5">
                        
                        {/* Actions Block */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => setViewMode('fullscreen')}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <Maximize2 size={16} /> Preview Fullscreen
                            </button>
                        </div>

                        {/* Templates Block */}
                        <div className="space-y-3">
                            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                                <LayoutTemplate size={12} /> Templates
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setTemplate('modern')}
                                    className={`group flex items-center gap-3 rounded-md border p-2 text-left transition-colors ${
                                        template === 'modern' 
                                        ? 'border-primary bg-primary/10' 
                                        : 'bg-background hover:bg-accent'
                                    }`}
                                >
                                    <div className="h-10 w-10 rounded-md border bg-neutral-950"></div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${template === 'modern' ? 'text-primary' : 'text-foreground'}`}>Aurora Dark</p>
                                        <p className="text-xs text-muted-foreground">Modern & Immersive</p>
                                    </div>
                                    {template === 'modern' && <CheckCircle2 size={16} className="text-primary"/>}
                                </button>

                                <button
                                    onClick={() => setTemplate('minimal')}
                                    className={`group flex items-center gap-3 rounded-md border p-2 text-left transition-colors ${
                                        template === 'minimal' 
                                        ? 'border-primary bg-primary/10' 
                                        : 'bg-background hover:bg-accent'
                                    }`}
                                >
                                    <div className="h-10 w-10 rounded-md border bg-background"></div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${template === 'minimal' ? 'text-primary' : 'text-foreground'}`}>Minimal Light</p>
                                        <p className="text-xs text-muted-foreground">Clean & Professional</p>
                                    </div>
                                    {template === 'minimal' && <CheckCircle2 size={16} className="text-primary"/>}
                                </button>
                            </div>
                        </div>
                        
                        <div className="h-px bg-border"></div>

                        <div className="space-y-3">
                            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Publish</h3>
                            <button 
                                onClick={handleCopyLink}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <LinkIcon size={16} /> Get Public Link
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium text-primary transition-colors hover:bg-accent"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>

                        <div className="rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
                            <p className="mb-2 font-semibold text-foreground">EDITING MODE</p>
                            <p>Click on any text in the preview to edit. Changes sync with your resume.</p>
                        </div>
                    </div>
                </aside>
            )}
        </>
    );
}
