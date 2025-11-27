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
const MinimalTemplate = ({ data, onUpdate, settings }) => {
  const { primaryColor, fontSize, fontFamily, columns } = settings;

  return (
    <div
      className="h-full w-full bg-white p-10"
      style={{
        fontFamily:
          fontFamily === "serif" ? "Georgia, serif" : "Inter, sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      <div
        className={`${
          columns === 2 ? "grid grid-cols-12 gap-12" : "flex flex-col gap-8"
        }`}
      >
        {/* Left / Top Column */}
        <div className={`${columns === 2 ? "col-span-4" : "w-full"}`}>
          <div className="mb-10">
            <EditableText
              value={data.personalInfo.name.split(" ")[0]}
              onChange={() => {}}
              className="text-5xl font-light tracking-tighter block -ml-1"
              style={{ color: primaryColor }}
            />
            <EditableText
              value={data.personalInfo.name.split(" ")[1] || ""}
              onChange={() => {}}
              className="text-5xl font-bold tracking-tighter block -ml-1 mb-4"
            />
            <EditableText
              value={data.personalInfo.title}
              onChange={(v) => onUpdate("personalInfo.title", v)}
              className="text-sm uppercase tracking-widest text-gray-500 block mb-8"
            />

            <div className="text-sm space-y-1 text-gray-600">
              <div className="block">
                <EditableText
                  value={data.personalInfo.email}
                  onChange={(v) => onUpdate("personalInfo.email", v)}
                />
              </div>
              <div className="block">
                <EditableText
                  value={data.personalInfo.phone}
                  onChange={(v) => onUpdate("personalInfo.phone", v)}
                />
              </div>
              <div className="block">
                <EditableText
                  value={data.personalInfo.location}
                  onChange={(v) => onUpdate("personalInfo.location", v)}
                />
              </div>
              <div className="block">
                <EditableText
                  value={data.personalInfo.website}
                  onChange={(v) => onUpdate("personalInfo.website", v)}
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">
              Education
            </h4>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <EditableText
                  value={edu.school}
                  onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                  className="font-semibold block"
                />
                <EditableText
                  value={edu.degree}
                  onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                  className="text-sm text-gray-600 block"
                />
                <EditableText
                  value={edu.date}
                  onChange={(v) => onUpdate(`education[${idx}].date`, v)}
                  className="text-xs text-gray-400 block"
                />
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase text-gray-400 mb-4">
              Skills
            </h4>
            <ul className="space-y-1">
              {data.skills.map((skill, idx) => (
                <li key={idx} className="text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right / Bottom Content */}
        <div className={`${columns === 2 ? "col-span-8" : "w-full"}`}>
          <section className="mb-10">
            <EditableText
              multiline
              value={data.personalInfo.summary}
              onChange={(v) => onUpdate("personalInfo.summary", v)}
              className="text-lg leading-relaxed text-gray-700 font-light"
            />
          </section>

          <section>
            <h4 className="font-bold text-xs uppercase text-gray-400 mb-6">
              Experience
            </h4>
            <div
              className="border-l-2 pl-6 space-y-8"
              style={{ borderColor: primaryColor }}
            >
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <span
                    className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2"
                    style={{ borderColor: primaryColor }}
                  ></span>
                  <div className="flex justify-between mb-1">
                    <EditableText
                      value={exp.role}
                      onChange={(v) => onUpdate(`experience[${idx}].role`, v)}
                      className="font-bold text-lg"
                    />
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <EditableText
                      value={exp.company}
                      onChange={(v) =>
                        onUpdate(`experience[${idx}].company`, v)
                      }
                      className="text-gray-600 font-medium"
                    />
                    <EditableText
                      value={exp.date}
                      onChange={(v) => onUpdate(`experience[${idx}].date`, v)}
                      className="text-gray-400"
                    />
                  </div>
                  <EditableText
                    multiline
                    value={exp.description}
                    onChange={(v) =>
                      onUpdate(`experience[${idx}].description`, v)
                    }
                    className="text-gray-700 leading-relaxed text-sm"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
