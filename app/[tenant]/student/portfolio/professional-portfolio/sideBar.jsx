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
                <div className="w-72 bg-black border-r border-gray-800 flex flex-col z-20 shrink-0 h-full overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b border-gray-800 sticky top-0 bg-black z-10">
                        <button 
                            onClick={onBack} 
                            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-blue-500" size={20}/>
                            Portfolio Studio
                        </h1>
                    </div>

                    <div className="p-6 space-y-8 flex-1">
                        
                        {/* Actions Block */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => setViewMode('fullscreen')}
                                className="w-full py-2.5 px-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                            >
                                <Maximize2 size={16} /> Preview Fullscreen
                            </button>
                        </div>

                        {/* Templates Block */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <LayoutTemplate size={12} /> Templates
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setTemplate('modern')}
                                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all text-left group ${
                                        template === 'modern' 
                                        ? 'bg-blue-900/20 border-blue-500/50' 
                                        : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-900 to-black border border-gray-700"></div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${template === 'modern' ? 'text-blue-400' : 'text-gray-300'}`}>Aurora Dark</p>
                                        <p className="text-[10px] text-gray-500">Modern & Immersive</p>
                                    </div>
                                    {template === 'modern' && <CheckCircle2 size={16} className="text-blue-500"/>}
                                </button>

                                <button
                                    onClick={() => setTemplate('minimal')}
                                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all text-left group ${
                                        template === 'minimal' 
                                        ? 'bg-blue-900/20 border-blue-500/50' 
                                        : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded bg-white border border-gray-300"></div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${template === 'minimal' ? 'text-blue-400' : 'text-gray-300'}`}>Minimal Light</p>
                                        <p className="text-[10px] text-gray-500">Clean & Professional</p>
                                    </div>
                                    {template === 'minimal' && <CheckCircle2 size={16} className="text-blue-500"/>}
                                </button>
                            </div>
                        </div>
                        
                        <div className="h-px bg-gray-800"></div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Publish</h3>
                            <button 
                                onClick={handleCopyLink}
                                className="w-full py-2.5 px-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                            >
                                <LinkIcon size={16} /> Get Public Link
                            </button>
                            <button 
                                onClick={handleSave}
                                className="w-full py-2.5 px-4 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-green-400 hover:text-green-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>

                        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 text-xs text-gray-500">
                            <p className="mb-2 font-bold text-gray-400">EDITING MODE</p>
                            <p>Click on any text in the preview to edit. Changes sync with your resume.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
