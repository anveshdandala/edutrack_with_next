import React, { useRef } from "react";
import EditableText from "@/components/resume/ui/EditableText";
import SectionWrapper, {
  SectionItemWrapper,
} from "@/components/resume/ui/SectionWrapper";
import { TemplateProps } from "@/hooks/types";
import { X } from "lucide-react";

const MinimalTemplate = ({
  data,
  onUpdate,
  onAdd,
  onRemove,
  settings,
  onToggleSection,
  onSettingsUpdate,
}) => {
  const {
    primaryColor,
    fontSize,
    fontFamily,
    columns,
    hiddenSections,
    leftColumnWidth = 35,
  } = settings;
  const isVisible = (section) => !hiddenSections.includes(section);
  const isTwoCol = columns === 2;

  const firstName = data.name.split(" ")[0];
  const lastName = data.name.split(" ").slice(1).join(" ");

  const containerRef = useRef < HTMLDivElement > null;

  const handleDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftColumnWidth;

    const onMouseMove = (moveEvent) => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const deltaX = moveEvent.clientX - startX;
        const deltaPercent = (deltaX / containerWidth) * 100;

        let newWidth = startWidth + deltaPercent;
        newWidth = Math.max(20, Math.min(80, newWidth));
        onSettingsUpdate("leftColumnWidth", newWidth);
      }
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
      className="h-full w-full bg-white p-10"
      style={{
        fontFamily:
          fontFamily === "serif" ? "'Georgia', serif" : "'Inter', sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      <div
        className={`relative h-full ${
          isTwoCol ? "flex gap-12" : "flex flex-col gap-8"
        }`}
      >
        {/* Resizer */}
        {isTwoCol && (
          <div
            className="absolute top-0 bottom-0 w-4 z-10 cursor-col-resize group flex items-center justify-center print:hidden hover:bg-blue-500/10 transition-colors"
            style={{ left: `calc(${leftColumnWidth}% + 1.25rem)` }} // offset for gap
            onMouseDown={handleDrag}
          >
            <div className="h-8 w-1 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors" />
          </div>
        )}

        {/* Left / Top Column */}
        <div
          className={`${isTwoCol ? "" : "w-full"}`}
          style={{ width: isTwoCol ? `${leftColumnWidth}%` : "100%" }}
        >
          <div className="mb-10">
            <EditableText
              value={firstName}
              onChange={(v) => onUpdate("name", `${v} ${lastName}`)}
              className="text-5xl font-light tracking-tighter block -ml-1"
              style={{ color: primaryColor }}
              placeholder="First Name"
            />
            <EditableText
              value={lastName || ""}
              onChange={(v) => onUpdate("name", `${firstName} ${v}`)}
              className="text-5xl font-bold tracking-tighter block -ml-1 mb-4"
              placeholder="Last Name"
            />
            <EditableText
              value={data.position}
              onChange={(v) => onUpdate("position", v)}
              className="text-sm uppercase tracking-widest text-gray-500 block mb-8"
              placeholder="Position"
            />

            <div className="text-sm space-y-2 text-gray-600">
              {data.email && (
                <EditableText
                  value={data.email}
                  onChange={(v) => onUpdate("email", v)}
                  placeholder="Email"
                />
              )}
              {data.phone && (
                <EditableText
                  value={data.phone}
                  onChange={(v) => onUpdate("phone", v)}
                  placeholder="Phone"
                />
              )}
              {data.address && (
                <EditableText
                  value={data.address}
                  onChange={(v) => onUpdate("address", v)}
                  placeholder="Address"
                />
              )}
              {data.socialMedia.map((social, idx) => (
                <SectionItemWrapper
                  key={idx}
                  onDelete={() => onRemove("socialMedia", idx)}
                >
                  <EditableText
                    value={social.url}
                    onChange={(v) => onUpdate(`socialMedia[${idx}].url`, v)}
                    className="text-blue-600"
                  />
                </SectionItemWrapper>
              ))}
            </div>
          </div>

          {isVisible("education") && (
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
              {data.education.map((edu, idx) => (
                <SectionItemWrapper
                  key={idx}
                  onDelete={() => onRemove("education", idx)}
                  className="mb-4"
                >
                  <EditableText
                    value={edu.school}
                    onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                    className="font-semibold block"
                    placeholder="School Name"
                  />
                  <EditableText
                    value={edu.degree}
                    onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                    className="text-sm text-gray-600 block"
                    placeholder="Degree"
                  />
                  <div className="flex gap-1 text-xs text-gray-400">
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

          {isVisible("skills") && (
            <SectionWrapper
              title="Skills"
              onAdd={() => onAdd("skills", { title: "New", skills: ["Skill"] })}
              onHide={() => onToggleSection("skills")}
              color={primaryColor}
            >
              {data.skills.map((skillGroup, idx) => (
                <SectionItemWrapper
                  key={idx}
                  onDelete={() => onRemove("skills", idx)}
                  className="mb-4"
                >
                  <EditableText
                    value={skillGroup.title}
                    onChange={(v) => onUpdate(`skills[${idx}].title`, v)}
                    className="font-bold text-xs uppercase text-gray-400 mb-1"
                  />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {skillGroup.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="relative group/skill">
                        <EditableText
                          value={skill}
                          onChange={(v) => {
                            const newSkills = [...skillGroup.skills];
                            newSkills[sIdx] = v;
                            onUpdate(`skills[${idx}].skills`, newSkills);
                          }}
                          className="text-sm inline-block min-w-[30px]"
                        />
                        {/* Comma separation simulation */}
                        {sIdx < skillGroup.skills.length - 1 && (
                          <span className="text-gray-400 mr-1">,</span>
                        )}

                        <button
                          onClick={() => {
                            const newSkills = skillGroup.skills.filter(
                              (_, i) => i !== sIdx
                            );
                            onUpdate(`skills[${idx}].skills`, newSkills);
                          }}
                          className="absolute -top-1.5 -right-1 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover/skill:opacity-100 transition-opacity print:hidden z-10"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newSkills = [...skillGroup.skills, "New"];
                        onUpdate(`skills[${idx}].skills`, newSkills);
                      }}
                      className="text-xs text-blue-500 px-1 hover:underline print:hidden"
                    >
                      +
                    </button>
                  </div>
                </SectionItemWrapper>
              ))}
            </SectionWrapper>
          )}

          {isVisible("languages") && data.languages.length > 0 && (
            <SectionWrapper
              title="Languages"
              className="mt-8"
              onHide={() => onToggleSection("languages")}
              color={primaryColor}
            >
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, idx) => (
                  <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("languages", idx)}
                  >
                    <span className="text-sm text-gray-600 border-b border-gray-200">
                      <EditableText
                        value={lang}
                        onChange={(v) => {
                          const l = [...data.languages];
                          l[idx] = v;
                          onUpdate("languages", l);
                        }}
                      />
                    </span>
                  </SectionItemWrapper>
                ))}
              </div>
            </SectionWrapper>
          )}
        </div>

        {/* Right / Bottom Content */}
        <div
          className={`${isTwoCol ? "" : "w-full"}`}
          style={{ width: isTwoCol ? `${100 - leftColumnWidth}%` : "100%" }}
        >
          {isVisible("summary") && (
            <SectionWrapper
              className="mb-10"
              onHide={() => onToggleSection("summary")}
            >
              <EditableText
                multiline
                value={data.summary}
                onChange={(v) => onUpdate("summary", v)}
                className="text-lg leading-relaxed text-gray-700 font-light"
                placeholder="Summary..."
              />
            </SectionWrapper>
          )}

          {isVisible("workExperience") && (
            <SectionWrapper
              title="Experience"
              onAdd={() =>
                onAdd("workExperience", {
                  company: "Company",
                  position: "Position",
                  startDate: "2022",
                  endDate: "Present",
                  description: "Details...",
                })
              }
              onHide={() => onToggleSection("workExperience")}
              color={primaryColor}
            >
              <div
                className="border-l-2 pl-6 space-y-8 mt-6"
                style={{ borderColor: primaryColor }}
              >
                {data.workExperience.map((exp, idx) => (
                  <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("workExperience", idx)}
                    className="relative"
                  >
                    <span
                      className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2"
                      style={{ borderColor: primaryColor }}
                    ></span>
                    <div className="flex justify-between mb-1 items-baseline">
                      <EditableText
                        value={exp.position}
                        onChange={(v) =>
                          onUpdate(`workExperience[${idx}].position`, v)
                        }
                        className="font-bold text-lg"
                        placeholder="Position"
                      />
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <EditableText
                        value={exp.company}
                        onChange={(v) =>
                          onUpdate(`workExperience[${idx}].company`, v)
                        }
                        className="text-gray-600 font-medium"
                        placeholder="Company"
                      />
                      <div className="flex gap-1 text-gray-400">
                        <EditableText
                          value={exp.startDate}
                          onChange={(v) =>
                            onUpdate(`workExperience[${idx}].startDate`, v)
                          }
                        />
                        -
                        <EditableText
                          value={exp.endDate}
                          onChange={(v) =>
                            onUpdate(`workExperience[${idx}].endDate`, v)
                          }
                        />
                      </div>
                    </div>
                    <EditableText
                      multiline
                      value={exp.description}
                      onChange={(v) =>
                        onUpdate(`workExperience[${idx}].description`, v)
                      }
                      className="text-gray-700 leading-relaxed text-sm"
                      placeholder="Description"
                    />
                  </SectionItemWrapper>
                ))}
              </div>
            </SectionWrapper>
          )}

          {isVisible("projects") && data.projects.length > 0 && (
            <SectionWrapper
              title="Projects"
              className="mt-10"
              onAdd={() =>
                onAdd("projects", {
                  title: "Project",
                  description: "Desc",
                  technologies: [],
                })
              }
              onHide={() => onToggleSection("projects")}
              color={primaryColor}
            >
              <div className="space-y-6 mt-4">
                {data.projects.map((proj, idx) => (
                  <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("projects", idx)}
                    className="relative"
                  >
                    <div className="flex justify-between mb-1 items-baseline">
                      <EditableText
                        value={proj.title}
                        onChange={(v) => onUpdate(`projects[${idx}].title`, v)}
                        className="font-bold text-lg"
                        placeholder="Project Title"
                      />
                      <EditableText
                        value={proj.link}
                        onChange={(v) => onUpdate(`projects[${idx}].link`, v)}
                        className="text-sm text-blue-500"
                        placeholder="Link"
                      />
                    </div>
                    <EditableText
                      multiline
                      value={proj.description}
                      onChange={(v) =>
                        onUpdate(`projects[${idx}].description`, v)
                      }
                      className="text-gray-700 leading-relaxed text-sm mb-2"
                      placeholder="Description"
                    />
                    <EditableText
                      value={
                        proj.technologies ? proj.technologies.join(" • ") : ""
                      }
                      onChange={(v) =>
                        onUpdate(
                          `projects[${idx}].technologies`,
                          v.split(" • ")
                        )
                      }
                      className="text-xs text-gray-400"
                      placeholder="Tech Stack"
                    />
                  </SectionItemWrapper>
                ))}
              </div>
            </SectionWrapper>
          )}

          {isVisible("certifications") && data.certifications.length > 0 && (
            <SectionWrapper
              title="Certifications"
              className="mt-8"
              onAdd={() => onAdd("certifications", "Certificate")}
              onHide={() => onToggleSection("certifications")}
              color={primaryColor}
            >
              <div className="grid grid-cols-2 gap-4 mt-4">
                {data.certifications.map((cert, idx) => (
                  <SectionItemWrapper
                    key={idx}
                    onDelete={() => onRemove("certifications", idx)}
                    className="bg-gray-50 p-2 rounded"
                  >
                    <EditableText
                      value={cert}
                      onChange={(v) => {
                        const c = [...data.certifications];
                        c[idx] = v;
                        onUpdate("certifications", c);
                      }}
                      className="text-sm font-medium text-gray-700"
                    />
                  </SectionItemWrapper>
                ))}
              </div>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
