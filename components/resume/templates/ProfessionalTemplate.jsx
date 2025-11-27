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
const ProfessionalTemplate = ({ data, onUpdate, settings }) => {
  const { primaryColor, fontSize, fontFamily } = settings;

  return (
    <div
      className="h-full w-full bg-white"
      style={{
        fontFamily:
          fontFamily === "serif" ? "Merriweather, serif" : "Arial, sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      <div
        className="h-4 w-full"
        style={{ backgroundColor: primaryColor }}
      ></div>

      <div className="p-10">
        <header className="flex justify-between items-center border-b pb-8 mb-8">
          <div>
            <EditableText
              value={data.personalInfo.name}
              onChange={(v) => onUpdate("personalInfo.name", v)}
              className="text-4xl font-bold uppercase text-gray-900 mb-1 block"
            />
            <EditableText
              value={data.personalInfo.title}
              onChange={(v) => onUpdate("personalInfo.title", v)}
              className="text-lg text-gray-600 font-medium block"
              style={{ color: primaryColor }}
            />
          </div>
          <div className="text-right text-sm space-y-1 text-gray-600">
            <EditableText
              value={data.personalInfo.email}
              onChange={(v) => onUpdate("personalInfo.email", v)}
              className="block text-right"
            />
            <EditableText
              value={data.personalInfo.phone}
              onChange={(v) => onUpdate("personalInfo.phone", v)}
              className="block text-right"
            />
            <EditableText
              value={data.personalInfo.location}
              onChange={(v) => onUpdate("personalInfo.location", v)}
              className="block text-right"
            />
            <EditableText
              value={data.personalInfo.linkedin}
              onChange={(v) => onUpdate("personalInfo.linkedin", v)}
              className="block text-right"
            />
          </div>
        </header>

        <section className="mb-8">
          <h3 className="uppercase font-bold text-sm tracking-widest mb-3 text-gray-800">
            Summary
          </h3>
          <EditableText
            multiline
            value={data.personalInfo.summary}
            onChange={(v) => onUpdate("personalInfo.summary", v)}
            className="text-gray-700"
          />
        </section>

        <section className="mb-8">
          <h3 className="uppercase font-bold text-sm tracking-widest mb-4 text-gray-800 flex items-center gap-2">
            Experience
            <span className="flex-1 h-px bg-gray-200"></span>
          </h3>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex justify-between mb-1">
                <EditableText
                  value={exp.role}
                  onChange={(v) => onUpdate(`experience[${idx}].role`, v)}
                  className="font-bold text-gray-900"
                />
                <EditableText
                  value={exp.date}
                  onChange={(v) => onUpdate(`experience[${idx}].date`, v)}
                  className="font-bold text-gray-900"
                />
              </div>
              <EditableText
                value={exp.company}
                onChange={(v) => onUpdate(`experience[${idx}].company`, v)}
                className="text-sm font-medium italic mb-2 block"
                style={{ color: primaryColor }}
              />
              <EditableText
                multiline
                value={exp.description}
                onChange={(v) => onUpdate(`experience[${idx}].description`, v)}
                className="text-gray-700 text-sm"
              />
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <h3 className="uppercase font-bold text-sm tracking-widest mb-4 text-gray-800 flex items-center gap-2">
              Education
              <span className="flex-1 h-px bg-gray-200"></span>
            </h3>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <EditableText
                  value={edu.school}
                  onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                  className="font-bold block"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <EditableText
                    value={edu.degree}
                    onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                  />
                  <EditableText
                    value={edu.date}
                    onChange={(v) => onUpdate(`education[${idx}].date`, v)}
                  />
                </div>
              </div>
            ))}
          </section>

          <section>
            <h3 className="uppercase font-bold text-sm tracking-widest mb-4 text-gray-800 flex items-center gap-2">
              Core Competencies
              <span className="flex-1 h-px bg-gray-200"></span>
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
