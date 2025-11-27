"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Layout,
  Type,
  Palette,
  Grid,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
} from "lucide-react";
import EditableText from "../ui/EditableText";
const ModernTemplate = ({ data, onUpdate, settings }) => {
  const { primaryColor, fontSize, fontFamily, columns } = settings;
  const isSingleCol = columns === 1;

  return (
    <div
      className={`h-full w-full bg-white text-slate-800 flex flex-col`}
      style={{
        fontFamily:
          fontFamily === "serif"
            ? "Georgia, serif"
            : fontFamily === "mono"
            ? "Courier New, monospace"
            : "Inter, sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Header */}
      <header
        className="p-8 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <EditableText
          tagName="h1"
          value={data.personalInfo.name}
          onChange={(val) => onUpdate("personalInfo.name", val)}
          className="text-4xl font-bold mb-2 block w-full"
        />
        <EditableText
          tagName="p"
          value={data.personalInfo.title}
          onChange={(val) => onUpdate("personalInfo.title", val)}
          className="text-xl opacity-90 block w-full"
        />
      </header>

      <div
        className={`flex-1 p-8 ${
          isSingleCol ? "flex flex-col gap-8" : "grid grid-cols-12 gap-8"
        }`}
      >
        {/* Main Content */}
        <div className={isSingleCol ? "w-full" : "col-span-8 order-2"}>
          {/* Summary */}
          <section className="mb-8">
            <h3
              className="uppercase tracking-wider font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Profile
            </h3>
            <EditableText
              multiline
              value={data.personalInfo.summary}
              onChange={(val) => onUpdate("personalInfo.summary", val)}
              className="leading-relaxed"
            />
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h3
              className="uppercase tracking-wider font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Experience
            </h3>
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="mb-6 last:mb-0 group relative">
                <div className="flex justify-between items-baseline mb-1">
                  <EditableText
                    value={exp.role}
                    onChange={(v) => onUpdate(`experience[${index}].role`, v)}
                    className="font-bold text-lg"
                  />
                  <EditableText
                    value={exp.date}
                    onChange={(v) => onUpdate(`experience[${index}].date`, v)}
                    className="text-sm text-slate-500 text-right w-32"
                  />
                </div>
                <EditableText
                  value={exp.company}
                  onChange={(v) => onUpdate(`experience[${index}].company`, v)}
                  className="italic text-slate-600 mb-2 block"
                />
                <EditableText
                  multiline
                  value={exp.description}
                  onChange={(v) =>
                    onUpdate(`experience[${index}].description`, v)
                  }
                  className="text-sm leading-relaxed"
                />
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className={isSingleCol ? "w-full" : "col-span-4 order-1"}>
          <div className="bg-slate-50 p-6 rounded-lg h-full">
            {/* Contact */}
            <section className="mb-8">
              <h3
                className="uppercase tracking-wider font-bold mb-4 text-sm"
                style={{ color: primaryColor }}
              >
                Contact
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <EditableText
                    value={data.personalInfo.email}
                    onChange={(v) => onUpdate("personalInfo.email", v)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <EditableText
                    value={data.personalInfo.phone}
                    onChange={(v) => onUpdate("personalInfo.phone", v)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <EditableText
                    value={data.personalInfo.location}
                    onChange={(v) => onUpdate("personalInfo.location", v)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} />
                  <EditableText
                    value={data.personalInfo.website}
                    onChange={(v) => onUpdate("personalInfo.website", v)}
                  />
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="mb-8">
              <h3
                className="uppercase tracking-wider font-bold mb-4 text-sm"
                style={{ color: primaryColor }}
              >
                Education
              </h3>
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="mb-4">
                  <EditableText
                    value={edu.degree}
                    onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                    className="font-bold block leading-tight"
                  />
                  <EditableText
                    value={edu.school}
                    onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                    className="text-sm mt-1 block"
                  />
                  <EditableText
                    value={edu.date}
                    onChange={(v) => onUpdate(`education[${idx}].date`, v)}
                    className="text-xs text-slate-500 block"
                  />
                </div>
              ))}
            </section>

            {/* Skills */}
            <section>
              <h3
                className="uppercase tracking-wider font-bold mb-4 text-sm"
                style={{ color: primaryColor }}
              >
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <input
                    key={idx}
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...data.skills];
                      newSkills[idx] = e.target.value;
                      onUpdate("skills", newSkills);
                    }}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-xs w-full"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
