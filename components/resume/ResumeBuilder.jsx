"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import resumeDefaultData from "@/components/resume/resumeDefaultData.js";
import ModernTemplate from "@/components/resume/templates/ModernTemplate";
import ClassicTemplate from "@/components/resume/templates/ClassicTemplate";
import MinimalTemplate from "@/components/resume/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/resume/templates/ProfessionalTemplate";
import {
  Download,
  Layout,
  Palette,
  PlusCircle,
  Eye,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper: Handles nested updates (e.g., workExperience[0].role)
const updateNestedState = (obj, path, value) => {
  const newObj = JSON.parse(JSON.stringify(obj));

  if (!path.includes("[")) {
    newObj[path] = value;
    return newObj;
  }

  const regex = /(\w+)\[(\d+)\]\.(\w+)/;
  const matches = path.match(regex);
  if (matches) {
    const [_, section, indexStr, field] = matches;
    const index = parseInt(indexStr);
    if (newObj[section] && newObj[section][index]) {
      newObj[section][index][field] = value;
    }
  }
  return newObj;
};

// Default items for "Add" button - Matched to your NEW fields
const defaultItems = {
  workExperience: {
    role: "New Role",
    company: "Company",
    startDate: "",
    endDate: "",
    description: "Description",
  },
  education: {
    school: "School Name",
    degree: "Degree",
    startYear: "",
    endYear: "",
  },
  projects: {
    title: "Project Name",
    description: "Project Description",
    link: "",
  },
  skills: { title: "Skill Category", skills: ["New Skill"] },
  certifications: "New Certification",
  languages: "New Language",
};

export default function ResumeBuilder({ initialData }) {
  // Use fetched data, fallback to default if null
  const [resumeData, setResumeData] = useState(
    initialData || resumeDefaultData
  );
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [settings, setSettings] = useState({
    primaryColor: "#2563eb",
    fontSize: 16,
    columns: 2,
    fontFamily: "sans",
    hiddenSections: [],
    leftColumnWidth: 30,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const templates = [
    { id: "modern", label: "Modern", component: ModernTemplate },
    { id: "classic", label: "Classic", component: ClassicTemplate },
    {
      id: "professional",
      label: "Professional",
      component: ProfessionalTemplate,
    },
    { id: "minimal", label: "Minimal", component: MinimalTemplate },
  ];

  const CurrentTemplate =
    templates.find((t) => t.id === selectedTemplate)?.component ??
    ModernTemplate;

  const handleDownload = async () => {
    const printContent = document.getElementById("resume-preview");
    if (!printContent) return;

    setIsDownloading(true);
    try {
      document.body.classList.add("printing");
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(printContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `resume-${(resumeData.name || "resume")
          .replace(/\s+/g, "-")
          .toLowerCase()}.pdf`
      );
    } catch (err) {
      console.error("PDF generation failed, falling back to print()", err);
      window.print();
    } finally {
      document.body.classList.remove("printing");
      setIsDownloading(false);
    }
  };

  const handleDataUpdate = (path, value) => {
    setResumeData((prev) => updateNestedState(prev, path, value));
  };

  // Fixed: Now uses defaultItems to prevent undefined errors
  const handleAddItem = (section) => {
    const newItem = defaultItems[section];
    if (newItem) {
      setResumeData((prev) => ({
        ...prev,
        [section]: [...(prev[section] || []), newItem],
      }));
    } else {
      console.warn(`No default item defined for section: ${section}`);
    }
  };

  const handleRemoveItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== index),
    }));
  };

  const handleToggleSection = (section) => {
    setSettings((prev) => {
      const isHidden = prev.hiddenSections.includes(section);
      return {
        ...prev,
        hiddenSections: isHidden
          ? prev.hiddenSections.filter((s) => s !== section)
          : [...prev.hiddenSections, section],
      };
    });
  };

  const handleSettingsUpdate = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const colors = [
    "#000000",
    "#334155",
    "#2563eb",
    "#059669",
    "#dc2626",
    "#9333ea",
    "#db2777",
    "#854d0e",
    "#0891b2",
    "#4f46e5",
  ];
  const sectionsList = [
    { key: "workExperience", label: "Experience" },

    { key: "education", label: "Education" },

    { key: "projects", label: "Projects" },

    { key: "skills", label: "Skills" },

    { key: "certifications", label: "Certifications" },

    { key: "languages", label: "Languages" },

    { key: "summary", label: "Summary" },
  ];

  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar Controls */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 print:hidden shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            Resume Forge
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Professional Resume Builder
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">
            {/* Template Selection */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layout size={14} /> Template
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-left flex flex-col gap-1 hover:shadow-md ${
                      selectedTemplate === t.id
                        ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-200"
                    }`}
                  >
                    <span className="block">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appearance Settings */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Palette size={14} /> Appearance
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleSettingsUpdate("primaryColor", c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        settings.primaryColor === c
                          ? "border-gray-900 scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) =>
                      handleSettingsUpdate("fontFamily", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="sans">Modern Sans</option>
                    <option value="serif">Classic Serif</option>
                    <option value="mono">Monospace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size ({settings.fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="18"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) =>
                      handleSettingsUpdate("fontSize", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layout Columns
                  </label>
                  <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      onClick={() => handleSettingsUpdate("columns", 1)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded ${
                        settings.columns === 1
                          ? "bg-white shadow text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => handleSettingsUpdate("columns", 2)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded ${
                        settings.columns === 2
                          ? "bg-white shadow text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Double
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manage Sections */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PlusCircle size={14} /> Manage Sections
              </h2>
              <div className="flex flex-wrap gap-2">
                {sectionsList.map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => handleToggleSection(sec.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${
                      settings.hiddenSections.includes(sec.key)
                        ? "bg-white text-gray-400 border-gray-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {settings.hiddenSections.includes(sec.key) ? (
                      <PlusCircle size={12} />
                    ) : (
                      <Eye size={12} />
                    )}
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-8 print:p-0 print:bg-white">
        <div
          className="bg-white shadow-2xl print:shadow-none transition-transform duration-300 origin-top relative"
          style={{
            width: "210mm",
            minHeight: "297mm",
            height: "297mm",
            overflow: "hidden",
          }}
        >
          <div id="resume-preview" className="h-full w-full">
            <CurrentTemplate
              data={resumeData}
              onUpdate={handleDataUpdate}
              onAdd={handleAddItem}
              onRemove={handleRemoveItem}
              settings={settings}
              onToggleSection={handleToggleSection}
              onSettingsUpdate={handleSettingsUpdate}
            />
          </div>

          {/* Overlay hint for interactivity */}
          <div className="absolute top-0 -right-40 w-36 bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-xs text-gray-500 print:hidden hidden lg:block">
            <p className="font-semibold text-gray-700 mb-1">How to edit:</p>
            <ul className="list-disc pl-3 space-y-1">
              <li>Click text to edit</li>
              <li>Hover sections to add/remove items</li>
              <li>Drag divider to resize columns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
