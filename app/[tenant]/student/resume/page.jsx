"use client";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import resumeDefaultData from "../../../../components/resume/resumeDefaultData.js";
import ModernTemplate from "../../../../components/resume/templates/ModernTemplate.jsx";
import ClassicTemplate from "../../../../components/resume/templates/ClassicTemplate.jsx";
import MinimalTemplate from "../../../../components/resume/templates/MinimalTemplate.jsx";
import ProfessionalTemplate from "../../../../components/resume/templates/ProfessionalTemplate.jsx";
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

  // pick the component for the currently selected template
  const CurrentTemplate =
    templates.find((t) => t.id === selectedTemplate)?.component ??
    ModernTemplate;

  // handle PDF download (html2canvas + jsPDF), fallback to window.print()
  const handleDownload = async (id) => {
    const printContent = document.getElementById(id);
    if (!printContent) return;
    try {
      const canvas = await html2canvas(printContent, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    } catch (err) {
      console.error("PDF generation failed, falling back to print()", err);
      window.print();
    }
  };

  const handleDataUpdate = (path, value) => {
    setResumeData((prev) => updateNestedState(prev, path, value));
  };

  const handleSettingsUpdate = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Primary Color
          </label>
          <div className="grid grid-cols-5 gap-3">
            {[
              "#000000",
              "#334155",
              "#4767acff",
              "#059669",
              "#d15d5dff",
              "#905ee6ff",
              "#ad6083ff",
              "#835137ff",
              "#0891b2",
              "#726dd3ff",
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleSettingsUpdate("primaryColor", color)}
                className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                  settings.primaryColor === color
                    ? "ring-2 ring-offset-2 ring-black dark:ring-white scale-110"
                    : ""
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
                title={color}
              />
            ))}
          </div>
          {/* Optional: Display current hex code softly below */}
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Selected: <span className="font-mono">{settings.primaryColor}</span>
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
        <Button
          variant="contained"
          onClick={() => handleDownload("resume-preview")}
          fullWidth
        >
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
            className="w-[210mm] min-h-[297mm] shadow-2xl overflow-hidden print:shadow-none"
            data-resume-content
            style={{
              backgroundColor: "white",
              color: "black",
              "--primary-color": settings.primaryColor,
              "--font-size": `${settings.fontSize}px`,
              fontSize: `${settings.fontSize}px`,
              fontFamily:
                settings.fontFamily === "mono"
                  ? "monospace"
                  : settings.fontFamily === "serif"
                  ? "serif"
                  : "sans-serif",
            }}
          >
            <div id="resume-preview">
              <CurrentTemplate
                data={resumeData}
                onUpdate={handleDataUpdate}
                settings={settings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
