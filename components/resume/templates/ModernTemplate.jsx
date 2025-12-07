import React, { useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  GripVertical,
  X,
  Linkedin,
} from "lucide-react";
import EditableText from "@/components/resume/ui/EditableText";
import SectionWrapper, {
  SectionItemWrapper,
} from "@/components/resume/ui/SectionWrapper";

const ModernTemplate = ({
  data,
  onUpdate,
  onAdd,
  onRemove,
  settings,
  onToggleSection,
  onSettingsUpdate,
}) => {
  const {
    primaryColor = "#2563eb",
    fontSize = 16,
    fontFamily = "sans",
    columns = 2,
    hiddenSections = [],
    leftColumnWidth = 30,
  } = settings || {};

  const isSingleCol = columns === 1;
  const isVisible = (section) => !hiddenSections.includes(section);

  // FIX: Removed TypeScript syntax <HTMLDivElement>
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftColumnWidth;
    const containerWidth = containerRef.current
      ? containerRef.current.offsetWidth
      : 1000;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      let newWidth = startWidth + deltaPercent; // Dragging right increases left column
      newWidth = Math.max(20, Math.min(80, newWidth));
      onSettingsUpdate("leftColumnWidth", newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={`h-full w-full bg-white text-slate-800 flex flex-col`}
      style={{
        fontFamily:
          fontFamily === "serif"
            ? "'Georgia', serif"
            : fontFamily === "mono"
            ? "'Courier Prime', monospace"
            : "'Inter', sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Header */}
      <header
        className="p-10 text-white flex justify-between items-start gap-8"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex-1">
            <EditableText
            tagName="h1"
            value={data.name || "Your Name"}
            onChange={(val) => onUpdate("name", val)}
            className="text-4xl font-bold mb-2 block w-full"
            placeholder="Your Name"
            />
            <EditableText
            tagName="p"
            value={data.position || "Professional Title"}
            onChange={(val) => onUpdate("position", val)}
            className="text-xl opacity-90 block w-full"
            placeholder="Professional Title"
            />
        </div>

        <div className="w-1/3 text-right">
             <SectionWrapper title="" className="mb-0" color="white" titleClassName="text-white/80 border-white/40">
                <div className="flex flex-col gap-2 text-sm items-end text-white/90">
                <div className="flex items-center gap-2 justify-end">
                    <EditableText
                    value={data.email || ""}
                    onChange={(v) => onUpdate("email", v)}
                    className="w-full text-right"
                    placeholder="Email"
                    />
                    <Mail size={14} className="shrink-0" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <EditableText
                    value={data.contactInformation || data.phone || ""}
                    onChange={(v) => onUpdate("contactInformation", v)}
                    className="w-full text-right"
                    placeholder="Phone"
                    />
                    <Phone size={14} className="shrink-0" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <EditableText
                    value={data.address ? data.address.split(',').slice(0, 2).map(s => s.trim()).join(', ') : ""}
                    onChange={(v) => onUpdate("address", v)}
                    className="w-full text-right"
                    placeholder="Address"
                    multiline
                    />
                    <MapPin size={14} className="shrink-0" />
                </div>
                {(data.socialMedia || []).map((social, idx) => (
                    <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("socialMedia", idx)}
                    className="flex items-center gap-2 justify-end"
                    >
                    <EditableText
                        value={typeof social === 'string' ? social : social.url}
                        onChange={(v) => onUpdate(`socialMedia[${idx}].url`, v)}
                        className="w-full text-right"
                    />
                    <Globe size={14} className="shrink-0" />
                    </SectionItemWrapper>
                ))}
                </div>
            </SectionWrapper>
        </div>
      </header>

      <div
        className={`flex-1 relative ${
          isSingleCol ? "flex flex-col" : "flex flex-row"
        }`}
      >
        {/* Resizer Handle (Only in 2-col mode) */}
        {!isSingleCol && (
          <div
            className="absolute top-0 bottom-0 w-4 -ml-2 z-10 cursor-col-resize group flex items-center justify-center print:hidden hover:bg-blue-500/10 transition-colors"
            style={{ left: `${leftColumnWidth}%` }}
            onMouseDown={handleDrag}
          >
            <div className="h-8 w-1 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors" />
          </div>
        )}

        {/* Sidebar (Left) */}
        <div
          className={`order-1 bg-slate-50 p-6 ${isSingleCol ? "w-full" : ""}`}
          style={{ width: isSingleCol ? "100%" : `${leftColumnWidth}%` }}
        >
          {/* Contact */}
          

          {/* Education */}
          {isVisible("education") && (data.education || []).length > 0 && (
            <SectionWrapper
              title="Education"
              className="mb-8"
              onAdd={() =>
                onAdd("education", {
                  school: "School",
                  degree: "Degree",
                  startYear: "2020",
                  endYear: "2024",
                })
              }
              onHide={() => onToggleSection("education")}
              color={primaryColor}
            >
              {(data.education || []).map((edu, idx) => (
                <SectionItemWrapper
                  key={idx}
                  onDelete={() => onRemove("education", idx)}
                  className="mb-4"
                >
                  <EditableText
                    value={edu.degree}
                    onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                    className="font-bold block leading-tight mb-1"
                    placeholder="Degree"
                  />
                  <EditableText
                    value={edu.school}
                    onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                    className="text-sm block"
                    placeholder="School"
                    multiline
                  />
                  <div className="flex gap-1 text-xs text-slate-500 mt-1">
                    <EditableText
                      value={edu.startYear}
                      onChange={(v) =>
                        onUpdate(`education[${idx}].startYear`, v)
                      }
                    />
                    -
                    <EditableText
                      value={edu.endYear}
                      onChange={(v) => onUpdate(`education[${idx}].endYear`, v)}
                    />
                  </div>
                </SectionItemWrapper>
              ))}
            </SectionWrapper>
          )}

          {/* Skills */}
          {isVisible("skills") && (data.skills || []).length > 0 && (
            <SectionWrapper
              title="Skills"
              onAdd={() =>
                onAdd("skills", { title: "Category", skills: ["Skill"] })
              }
              onHide={() => onToggleSection("skills")}
              color={primaryColor}
            >
              {(data.skills || []).map((skillGroup, idx) => {
                  // Handle if skillGroup is just a string (rare but possible in some formats)
                  if (typeof skillGroup === 'string') return null;

                  return (
                    <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("skills", idx)}
                    className="mb-4"
                    >
                    <EditableText
                        value={skillGroup.title}
                        onChange={(v) => onUpdate(`skills[${idx}].title`, v)}
                        className="font-semibold text-xs text-slate-500 uppercase mb-2"
                        placeholder="CATEGORY"
                    />
                    <div className="flex flex-wrap gap-2">
                        {(skillGroup.skills || []).map((skill, sIdx) => (
                        <div
                            key={sIdx}
                            className="relative group/skill flex-grow-0"
                        >
                            <EditableText
                            value={skill}
                            onChange={(v) => {
                                const newSkills = [...skillGroup.skills];
                                newSkills[sIdx] = v;
                                onUpdate(`skills[${idx}].skills`, newSkills);
                            }}
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs w-full min-w-[30px]"
                            />
                            <button
                            onClick={() => {
                                const newSkills = skillGroup.skills.filter(
                                (_, i) => i !== sIdx
                                );
                                onUpdate(`skills[${idx}].skills`, newSkills);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/skill:opacity-100 transition-opacity print:hidden"
                            >
                            <X size={8} />
                            </button>
                        </div>
                        ))}
                        <button
                        onClick={() => {
                            const newSkills = [...(skillGroup.skills || []), "New"];
                            onUpdate(`skills[${idx}].skills`, newSkills);
                        }}
                        className="text-xs text-blue-500 px-1 hover:underline print:hidden"
                        >
                        +
                        </button>
                    </div>
                    </SectionItemWrapper>
                  )
              })}
            </SectionWrapper>
          )}

          {/* Languages */}
          {isVisible("languages") && (data.languages || []).length > 0 && (
            <SectionWrapper
              title="Languages"
              className="mt-8"
              onAdd={() => onAdd("languages", "Language")}
              onHide={() => onToggleSection("languages")}
              color={primaryColor}
            >
              <ul className="list-disc ml-4">
                {(data.languages || []).map((lang, idx) => {
                  const langName = typeof lang === 'string' ? lang : lang.name;
                  return (
                    <li key={idx} className="text-sm mb-1">
                        <SectionItemWrapper
                        onDelete={() => onRemove("languages", idx)}
                        >
                        <EditableText
                            value={langName}
                            onChange={(v) => {
                                const l = [...data.languages];
                                if (typeof l[idx] === 'string') {
                                    l[idx] = v;
                                } else {
                                    l[idx] = { ...l[idx], name: v };
                                }
                                onUpdate("languages", l);
                            }}
                        />
                        </SectionItemWrapper>
                    </li>
                  );
                })}
              </ul>
            </SectionWrapper>
          )}
        </div>

        {/* Main Content (Right) */}
        <div
          className={`order-2 p-10 ${isSingleCol ? "w-full" : ""}`}
          style={{ width: isSingleCol ? "100%" : `${100 - leftColumnWidth}%` }}
        >
          {/* Summary */}
          {isVisible("summary") && (
            <SectionWrapper
              title="Profile"
              className="mb-8"
              onHide={() => onToggleSection("summary")}
              color={primaryColor}
            >
              <EditableText
                multiline
                value={data.summary || ""}
                onChange={(val) => onUpdate("summary", val)}
                className="leading-relaxed"
              />
            </SectionWrapper>
          )}

          {/* Experience */}
          {isVisible("workExperience") && (data.workExperience || []).length > 0 && (
            <SectionWrapper
              title="Experience"
              className="mb-8"
              onAdd={() =>
                onAdd("workExperience", {
                  company: "Company",
                  position: "Role",
                  startDate: "2023",
                  endDate: "Present",
                  description: "Details",
                })
              }
              onHide={() => onToggleSection("workExperience")}
              color={primaryColor}
            >
              {(data.workExperience || []).map((exp, index) => (
                <SectionItemWrapper
                  key={index}
                  onDelete={() => onRemove("workExperience", index)}
                  className="mb-6 last:mb-0 group relative"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <EditableText
                      value={exp.position}
                      onChange={(v) =>
                        onUpdate(`workExperience[${index}].position`, v)
                      }
                      className="font-bold text-lg"
                      placeholder="Role"
                    />
                    <div className="flex gap-1 text-sm text-slate-500 text-right w-32 shrink-0">
                      <EditableText
                        value={exp.startDate}
                        onChange={(v) =>
                          onUpdate(`workExperience[${index}].startDate`, v)
                        }
                      />
                      -
                      <EditableText
                        value={exp.endDate}
                        onChange={(v) =>
                          onUpdate(`workExperience[${index}].endDate`, v)
                        }
                      />
                    </div>
                  </div>
                  <EditableText
                    value={exp.company}
                    onChange={(v) =>
                      onUpdate(`workExperience[${index}].company`, v)
                    }
                    className="italic text-slate-600 mb-2 block"
                    placeholder="Company"
                  />
                  <EditableText
                    multiline
                    value={exp.description}
                    onChange={(v) =>
                      onUpdate(`workExperience[${index}].description`, v)
                    }
                    className="text-sm leading-relaxed"
                    placeholder="Responsibilities"
                  />
                </SectionItemWrapper>
              ))}
            </SectionWrapper>
          )}

          {/* Projects */}
          {isVisible("projects") && (data.projects || []).length > 0 && (
            <SectionWrapper
              title="Projects"
              className="mb-8"
              onAdd={() =>
                onAdd("projects", {
                  title: "Project",
                  description: "Details",
                  technologies: [],
                })
              }
              onHide={() => onToggleSection("projects")}
              color={primaryColor}
            >
              {(data.projects || []).map((proj, index) => (
                <SectionItemWrapper
                  key={index}
                  onDelete={() => onRemove("projects", index)}
                  className="mb-6 last:mb-0"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <EditableText
                      value={proj.title}
                      onChange={(v) => onUpdate(`projects[${index}].title`, v)}
                      className="font-bold text-lg"
                    />
                    <EditableText
                      value={proj.link}
                      onChange={(v) => onUpdate(`projects[${index}].link`, v)}
                      className="text-sm text-blue-600"
                      placeholder="Link"
                    />
                  </div>
                  <EditableText
                    multiline
                    value={proj.description}
                    onChange={(v) =>
                      onUpdate(`projects[${index}].description`, v)
                    }
                    className="text-sm leading-relaxed mb-1"
                  />
                  <EditableText
                    value={
                      proj.technologies ? proj.technologies.join(" | ") : ""
                    }
                    onChange={(v) =>
                      onUpdate(
                        `projects[${index}].technologies`,
                        v.split(" | ")
                      )
                    }
                    className="text-xs text-slate-500 font-mono"
                    placeholder="Tech Stack"
                  />
                </SectionItemWrapper>
              ))}
            </SectionWrapper>
          )}

          {/* Certifications */}
          {isVisible("certifications") && (data.certifications || []).length > 0 && (
            <SectionWrapper
              title="Certifications"
              className="mb-8"
              onAdd={() => onAdd("certifications", "Name")}
              onHide={() => onToggleSection("certifications")}
              color={primaryColor}
            >
              <ul className="list-disc ml-4">
                {(data.certifications || []).map((cert, idx) => {
                  const certName = typeof cert === 'string' ? cert : (cert.name || cert.title);
                  return (
                    <li key={idx} className="text-sm mb-1">
                        <SectionItemWrapper
                        onDelete={() => onRemove("certifications", idx)}
                        >
                        <EditableText
                            value={certName}
                            onChange={(v) => {
                            const c = [...data.certifications];
                            if (typeof c[idx] === 'string') {
                                c[idx] = v;
                            } else {
                                c[idx] = { ...c[idx], name: v };
                            }
                            onUpdate("certifications", c);
                            }}
                        />
                        </SectionItemWrapper>
                    </li>
                  );
                })}
              </ul>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
