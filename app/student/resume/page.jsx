"use client";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import resumeDefaultData from "../../../components/resume/resumeDefaultData.js";
import ModernTemplate from "../../../components/resume/templates/ModernTemplate";
import ClassicTemplate from "../../../components/resume/templates/ClassicTemplate";
import MinimalTemplate from "../../../components/resume/templates/MinimalTemplate";
import ProfessionalTemplate from "../../../components/resume/templates/ProfessionalTemplate";
import { Button } from "@mui/material";

const updateNestedState = (obj, path, value) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  if (!path.includes("[")) {
    newObj[path] = value;
    return newObj;
  }
  const regex = /(\w+)\[(\d+)\]\.(\w+)/;
  const matches = path.match(regex);
  if (matches) {
    const [_, section, index, field] = matches;
    newObj[section][index][field] = value;
  }
  return newObj;
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState(resumeDefaultData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [settings, setSettings] = useState({
    primaryColor: "#2563eb",
    fontSize: 16,
    columns: 2,
    fontFamily: "sans",
  });

  const handleDataUpdate = (path, value) => {
    setResumeData((prev) => updateNestedState(prev, path, value));
  };

  const handleSettingsUpdate = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleDownload = async () => {
    const printContent = document.getElementById("resume-preview");

    if (!printContent) return;

    // html2canvas configuration to avoid OKLCH errors and improve quality
    const canvas = await html2canvas(printContent, {
      scale: 2, // Higher resolution for PDF
      backgroundColor: "#ffffff", // Force white background
      useCORS: true, // Handle external images if any
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  };

  const CurrentTemplate =
    templates.find((t) => t.id === selectedTemplate)?.component ||
    ModernTemplate;

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 bg-card border-r border-border p-6 overflow-y-auto shadow-lg print:hidden">
        <h2 className="text-lg font-bold text-foreground mb-6">Settings</h2>

        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Template
          </label>
          <div className="flex flex-col gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-center ${
                  selectedTemplate === template.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Primary Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) =>
                handleSettingsUpdate("primaryColor", e.target.value)
              }
              className="w-12 h-10 rounded cursor-pointer border border-border"
            />
            <span className="text-xs text-muted-foreground">
              {settings.primaryColor}
            </span>
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Base Font Size
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="12"
              max="20"
              value={settings.fontSize}
              onChange={(e) =>
                handleSettingsUpdate(
                  "fontSize",
                  Number.parseInt(e.target.value)
                )
              }
              className="flex-1 cursor-pointer"
            />
            <span className="text-sm text-muted-foreground w-12 text-right">
              {settings.fontSize}px
            </span>
          </div>
        </div>

        {/* Font Family */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Font Family
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingsUpdate("fontFamily", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="sans">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </div>

        {/* Column Layout */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Layout Columns
          </label>
          <select
            value={settings.columns}
            onChange={(e) =>
              handleSettingsUpdate("columns", Number.parseInt(e.target.value))
            }
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1">Single Column</option>
            <option value="2">Two Columns</option>
          </select>
        </div>
        <Button variant="contained" onClick={handleDownload} fullWidth>
          Download PDF
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="bg-card border-b border-border p-4 shadow-sm shrink-0">
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
        </div>

        {/* Resume Preview */}
        <div className="flex-1 flex justify-center p-8 bg-gray-100 overflow-auto">
          <div
            id="resume-preview"
            // REMOVED 'bg-card' to prevent OKLCH error
            className="w-[210mm] min-h-[297mm] shadow-2xl overflow-hidden print:shadow-none"
            data-resume-content
            style={{
              backgroundColor: "white", // Explicit hex white prevents crash
              color: "black",
              "--primary-color": settings.primaryColor,
              "--font-size": `${settings.fontSize}px`,
              fontSize: `${settings.fontSize}px`,
              // Apply font family setting
              fontFamily:
                settings.fontFamily === "mono"
                  ? "monospace"
                  : settings.fontFamily === "serif"
                  ? "serif"
                  : "sans-serif",
            }}
          >
            {/* Settings passed to template */}
            <CurrentTemplate
              data={resumeData}
              onUpdate={handleDataUpdate}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
