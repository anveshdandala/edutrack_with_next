import React from "react";
import EditableText from "@/components/resume/ui/EditableText";
import SectionWrapper, {
  SectionItemWrapper,
} from "@/components/resume/ui/SectionWrapper";
import { TemplateProps } from "@/hooks/types";
import { X } from "lucide-react";

const ProfessionalTemplate = ({
  data,
  onUpdate,
  onAdd,
  onRemove,
  settings,
  onToggleSection,
}) => {
  const { primaryColor, fontSize, fontFamily, hiddenSections } = settings;
  const isVisible = (section) => !hiddenSections.includes(section);

  return (
    <div
      className="h-full w-full bg-white min-h-[297mm]"
      style={{
        fontFamily:
          fontFamily === "serif"
            ? "'Merriweather', serif"
            : "'Arial', sans-serif",
        fontSize: `${fontSize}px`,
      }}
    >
      <div
        className="h-4 w-full"
        style={{ backgroundColor: primaryColor }}
      ></div>

      <div className="p-10">
        <header className="flex justify-between items-start border-b pb-8 mb-8">
          <div className="flex-1">
            <EditableText
              value={data.name}
              onChange={(v) => onUpdate("name", v)}
              className="text-4xl font-bold uppercase text-gray-900 mb-1 block"
              placeholder="Full Name"
            />
            <EditableText
              value={data.position}
              onChange={(v) => onUpdate("position", v)}
              className="text-lg text-gray-600 font-medium block"
              style={{ color: primaryColor }}
              placeholder="Current Position"
            />
          </div>
          <div className="text-right text-sm space-y-1 text-gray-600 w-1/3">
            <EditableText
              value={data.email}
              onChange={(v) => onUpdate("email", v)}
              className="block text-right"
              placeholder="Email Address"
            />
            <EditableText
              value={data.phone}
              onChange={(v) => onUpdate("phone", v)}
              className="block text-right"
              placeholder="Phone Number"
            />
            <EditableText
              value={data.address}
              onChange={(v) => onUpdate("address", v)}
              className="block text-right"
              placeholder="Location"
            />
            {data.socialMedia.map((social, idx) => (
              <SectionItemWrapper
                key={idx}
                onDelete={() => onRemove("socialMedia", idx)}
              >
                <EditableText
                  value={social.url}
                  onChange={(v) => onUpdate(`socialMedia[${idx}].url`, v)}
                  className="block text-right"
                />
              </SectionItemWrapper>
            ))}
          </div>
        </header>

        {isVisible("summary") && (
          <SectionWrapper
            title="Summary"
            className="mb-8"
            onHide={() => onToggleSection("summary")}
            color={primaryColor}
          >
            <EditableText
              multiline
              value={data.summary}
              onChange={(v) => onUpdate("summary", v)}
              className="text-gray-700 leading-relaxed"
              placeholder="Professional summary..."
            />
          </SectionWrapper>
        )}

        {isVisible("workExperience") && (
          <SectionWrapper
            title="Experience"
            className="mb-8"
            onAdd={() =>
              onAdd("workExperience", {
                company: "Company",
                position: "Position",
                startDate: "2023",
                endDate: "Present",
                description: "Description",
              })
            }
            onHide={() => onToggleSection("workExperience")}
            color={primaryColor}
          >
            {data.workExperience.map((exp, idx) => (
              <SectionItemWrapper
                key={idx}
                onDelete={() => onRemove("workExperience", idx)}
                className="mb-6"
              >
                <div className="flex justify-between mb-1 items-baseline">
                  <EditableText
                    value={exp.position}
                    onChange={(v) =>
                      onUpdate(`workExperience[${idx}].position`, v)
                    }
                    className="font-bold text-gray-900 text-lg"
                  />
                  <div className="flex gap-1 font-bold text-gray-900 text-right w-32 shrink-0">
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
                  value={exp.company}
                  onChange={(v) =>
                    onUpdate(`workExperience[${idx}].company`, v)
                  }
                  className="text-sm font-medium italic mb-2 block"
                  style={{ color: primaryColor }}
                />
                <EditableText
                  multiline
                  value={exp.description}
                  onChange={(v) =>
                    onUpdate(`workExperience[${idx}].description`, v)
                  }
                  className="text-gray-700 text-sm leading-relaxed"
                />
              </SectionItemWrapper>
            ))}
          </SectionWrapper>
        )}

        {isVisible("projects") && data.projects.length > 0 && (
          <SectionWrapper
            title="Projects"
            className="mb-8"
            onAdd={() =>
              onAdd("projects", {
                title: "Title",
                description: "Desc",
                technologies: [],
              })
            }
            onHide={() => onToggleSection("projects")}
            color={primaryColor}
          >
            {data.projects.map((proj, idx) => (
              <SectionItemWrapper
                key={idx}
                onDelete={() => onRemove("projects", idx)}
                className="mb-6"
              >
                <div className="flex justify-between mb-1 items-baseline">
                  <EditableText
                    value={proj.title}
                    onChange={(v) => onUpdate(`projects[${idx}].title`, v)}
                    className="font-bold text-gray-900 text-lg"
                  />
                  <EditableText
                    value={proj.link}
                    onChange={(v) => onUpdate(`projects[${idx}].link`, v)}
                    className="text-blue-600 text-sm"
                    placeholder="Link"
                  />
                </div>
                <EditableText
                  multiline
                  value={proj.description}
                  onChange={(v) => onUpdate(`projects[${idx}].description`, v)}
                  className="text-gray-700 text-sm leading-relaxed mb-1"
                />
                <EditableText
                  value={proj.technologies ? proj.technologies.join(", ") : ""}
                  onChange={(v) =>
                    onUpdate(`projects[${idx}].technologies`, v.split(", "))
                  }
                  className="text-gray-500 text-xs italic"
                  placeholder="Technologies"
                />
              </SectionItemWrapper>
            ))}
          </SectionWrapper>
        )}

        <div className="grid grid-cols-2 gap-8">
          {isVisible("education") && (
            <div className="col-span-1">
              <SectionWrapper
                title="Education"
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
                      className="font-bold block"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <EditableText
                        value={edu.degree}
                        onChange={(v) =>
                          onUpdate(`education[${idx}].degree`, v)
                        }
                      />
                      <div className="flex gap-1">
                        <EditableText
                          value={edu.startYear}
                          onChange={(v) =>
                            onUpdate(`education[${idx}].startYear`, v)
                          }
                        />
                        -
                        <EditableText
                          value={edu.endYear}
                          onChange={(v) =>
                            onUpdate(`education[${idx}].endYear`, v)
                          }
                        />
                      </div>
                    </div>
                  </SectionItemWrapper>
                ))}
              </SectionWrapper>
            </div>
          )}

          <div className="col-span-1 space-y-6">
            {isVisible("skills") && (
              <SectionWrapper
                title="Core Competencies"
                onAdd={() =>
                  onAdd("skills", { title: "Category", skills: ["Skill"] })
                }
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
                      className="font-bold text-xs uppercase mb-1"
                      style={{ color: primaryColor }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="relative group/skill bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium"
                        >
                          <EditableText
                            value={skill}
                            onChange={(v) => {
                              const s = [...skillGroup.skills];
                              s[sIdx] = v;
                              onUpdate(`skills[${idx}].skills`, s);
                            }}
                            className="w-auto bg-transparent text-center min-w-[30px]"
                          />
                          <button
                            onClick={() => {
                              const newSkills = skillGroup.skills.filter(
                                (_, i) => i !== sIdx
                              );
                              onUpdate(`skills[${idx}].skills`, newSkills);
                            }}
                            className="absolute -top-1.5 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/skill:opacity-100 transition-opacity print:hidden z-10"
                          >
                            <X size={8} />
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

            {isVisible("certifications") && data.certifications.length > 0 && (
              <SectionWrapper
                title="Certifications"
                onAdd={() => onAdd("certifications", "Name")}
                onHide={() => onToggleSection("certifications")}
                color={primaryColor}
              >
                <ul className="list-square ml-4">
                  {data.certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm mb-1 text-gray-700">
                      <SectionItemWrapper
                        onDelete={() => onRemove("certifications", idx)}
                      >
                        <EditableText
                          value={cert}
                          onChange={(v) => {
                            const c = [...data.certifications];
                            c[idx] = v;
                            onUpdate("certifications", c);
                          }}
                        />
                      </SectionItemWrapper>
                    </li>
                  ))}
                </ul>
              </SectionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
