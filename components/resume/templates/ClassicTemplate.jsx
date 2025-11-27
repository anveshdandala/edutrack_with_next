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
const ClassicTemplate = ({ data, onUpdate, settings }) => {
  const { primaryColor, fontSize, fontFamily } = settings;

  return (
    <div
      className="h-full w-full bg-white text-black p-12 max-w-[210mm] mx-auto"
      style={{
        fontFamily:
          fontFamily === "sans"
            ? "Inter, sans-serif"
            : fontFamily === "mono"
            ? "Courier New, monospace"
            : "Georgia, serif",
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Header Centered */}
      <header
        className="text-center border-b-2 pb-6 mb-8"
        style={{ borderColor: primaryColor }}
      >
        <EditableText
          value={data.personalInfo.name}
          onChange={(v) => onUpdate("personalInfo.name", v)}
          className="text-3xl font-bold uppercase tracking-widest block text-center mb-2"
          style={{ color: primaryColor }}
        />
        <EditableText
          value={data.personalInfo.title}
          onChange={(v) => onUpdate("personalInfo.title", v)}
          className="text-lg italic text-slate-600 block text-center mb-4"
        />
        <div className="flex justify-center flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Mail size={12} />
            {data.personalInfo.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {data.personalInfo.phone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {data.personalInfo.location}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        <section>
          <h3 className="uppercase font-bold text-sm mb-3 pb-1 border-b border-gray-300">
            Professional Summary
          </h3>
          <EditableText
            multiline
            value={data.personalInfo.summary}
            onChange={(v) => onUpdate("personalInfo.summary", v)}
          />
        </section>

        <section>
          <h3 className="uppercase font-bold text-sm mb-3 pb-1 border-b border-gray-300">
            Experience
          </h3>
          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between font-bold">
                <EditableText
                  value={exp.role}
                  onChange={(v) => onUpdate(`experience[${idx}].role`, v)}
                />
                <EditableText
                  value={exp.date}
                  onChange={(v) => onUpdate(`experience[${idx}].date`, v)}
                />
              </div>
              <EditableText
                value={exp.company}
                onChange={(v) => onUpdate(`experience[${idx}].company`, v)}
                className="italic mb-2 block"
                style={{ color: primaryColor }}
              />
              <EditableText
                multiline
                value={exp.description}
                onChange={(v) => onUpdate(`experience[${idx}].description`, v)}
                className="text-sm"
              />
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h3 className="uppercase font-bold text-sm mb-3 pb-1 border-b border-gray-300">
              Education
            </h3>
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="mb-2">
                <EditableText
                  value={edu.degree}
                  onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                  className="font-bold block"
                />
                <EditableText
                  value={edu.school}
                  onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                  className="italic block text-sm"
                />
                <EditableText
                  value={edu.date}
                  onChange={(v) => onUpdate(`education[${idx}].date`, v)}
                  className="text-xs"
                />
              </div>
            ))}
          </section>

          <section>
            <h3 className="uppercase font-bold text-sm mb-3 pb-1 border-b border-gray-300">
              Technical Skills
            </h3>
            <div className="text-sm leading-relaxed">
              {data.skills.join(" • ")}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
