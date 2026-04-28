import React from "react";
import { Mail, MapPin, Globe, Linkedin, Phone, X } from "lucide-react";
import EditableText from "@/components/resume/ui/EditableText";
import SectionWrapper, {
  SectionItemWrapper,
} from "@/components/resume/ui/SectionWrapper";
import { TemplateProps } from "@/hooks/types";

const ClassicTemplate = ({
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
      className="h-full w-full bg-white text-black p-12 max-w-[210mm] mx-auto min-h-[297mm]"
      style={{
        fontFamily:
          fontFamily === "sans"
            ? "'Inter', sans-serif"
            : fontFamily === "mono"
            ? "'Courier Prime', monospace"
            : "'Georgia', serif",
        fontSize: `${fontSize}px`,
      }}
    >
      {/* Header Centered */}
      <header
        className="text-center border-b-2 pb-6 mb-8"
        style={{ borderColor: primaryColor }}
      >
        <EditableText
          value={data.name}
          onChange={(v) => onUpdate("name", v)}
          className="text-3xl font-bold uppercase tracking-widest block text-center mb-2 w-full"
          style={{ color: primaryColor }}
          placeholder="YOUR NAME"
        />
        <EditableText
          value={data.position}
          onChange={(v) => onUpdate("position", v)}
          className="text-lg italic text-slate-600 block text-center mb-4 w-full"
          placeholder="Your Professional Title"
        />
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} />
              <EditableText
                value={data.email}
                onChange={(v) => onUpdate("email", v)}
              />
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} />
              <EditableText
                value={data.phone}
                onChange={(v) => onUpdate("phone", v)}
              />
            </span>
          )}
          {data.address && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              <EditableText
                value={data.address}
                onChange={(v) => onUpdate("address", v)}
              />
            </span>
          )}
          {data.socialMedia.map((social, idx) => (
            <SectionItemWrapper
              key={idx}
              onDelete={() => onRemove("socialMedia", idx)}
              className="flex items-center gap-1"
            >
              <Globe size={12} />
              <EditableText
                value={social.url}
                onChange={(v) => onUpdate(`socialMedia[${idx}].url`, v)}
              />
            </SectionItemWrapper>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {isVisible("summary") && (
          <SectionWrapper
            title="Professional Summary"
            onHide={() => onToggleSection("summary")}
            color={primaryColor}
          >
            <EditableText
              multiline
              value={data.summary}
              onChange={(v) => onUpdate("summary", v)}
              className="leading-relaxed"
              placeholder="Write a short professional summary..."
            />
          </SectionWrapper>
        )}

        {isVisible("workExperience") && (
          <SectionWrapper
            title="Experience"
            onAdd={() =>
              onAdd("workExperience", {
                company: "New Company",
                position: "Role",
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
                className="mb-5"
              >
                <div className="flex justify-between font-bold items-baseline">
                  <EditableText
                    value={exp.position}
                    onChange={(v) =>
                      onUpdate(`workExperience[${idx}].position`, v)
                    }
                    className="text-lg"
                    placeholder="Position"
                  />
                  <div className="flex shrink-0 gap-1 whitespace-nowrap ml-4">
                    <EditableText
                      value={exp.startDate}
                      onChange={(v) =>
                        onUpdate(`workExperience[${idx}].startDate`, v)
                      }
                      className="text-right"
                      placeholder="Start"
                    />
                    <span>-</span>
                    <EditableText
                      value={exp.endDate}
                      onChange={(v) =>
                        onUpdate(`workExperience[${idx}].endDate`, v)
                      }
                      className="text-right"
                      placeholder="End"
                    />
                  </div>
                </div>
                <EditableText
                  value={exp.company}
                  onChange={(v) =>
                    onUpdate(`workExperience[${idx}].company`, v)
                  }
                  className="italic mb-2 block font-medium w-full"
                  style={{ color: primaryColor }}
                  placeholder="Company Name"
                />
                <EditableText
                  multiline
                  value={exp.description}
                  onChange={(v) =>
                    onUpdate(`workExperience[${idx}].description`, v)
                  }
                  className="text-sm leading-relaxed"
                  placeholder="Describe your responsibilities..."
                />
              </SectionItemWrapper>
            ))}
          </SectionWrapper>
        )}

        {isVisible("projects") && data.projects.length > 0 && (
          <SectionWrapper
            title="Projects"
            onAdd={() =>
              onAdd("projects", {
                title: "Project Name",
                link: "",
                description: "Project details...",
                technologies: ["Tech 1"],
              })
            }
            onHide={() => onToggleSection("projects")}
            color={primaryColor}
          >
            {data.projects.map((proj, idx) => (
              <SectionItemWrapper
                key={idx}
                onDelete={() => onRemove("projects", idx)}
                className="mb-5"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <EditableText
                    value={proj.title}
                    onChange={(v) => onUpdate(`projects[${idx}].title`, v)}
                    className="font-bold text-lg"
                    placeholder="Project Title"
                  />
                  <EditableText
                    value={proj.link}
                    onChange={(v) => onUpdate(`projects[${idx}].link`, v)}
                    className="text-xs text-blue-600 text-right w-1/3"
                    placeholder="Link"
                  />
                </div>
                <EditableText
                  multiline
                  value={proj.description}
                  onChange={(v) => onUpdate(`projects[${idx}].description`, v)}
                  className="text-sm leading-relaxed mb-2"
                  placeholder="Project Description"
                />
                <div className="text-xs text-gray-500 italic">
                  <EditableText
                    value={
                      proj.technologies ? proj.technologies.join(", ") : ""
                    }
                    onChange={(v) =>
                      onUpdate(`projects[${idx}].technologies`, v.split(", "))
                    }
                    className="w-full"
                    placeholder="Technologies used (comma separated)"
                  />
                </div>
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
                    school: "University",
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
                      value={edu.degree}
                      onChange={(v) => onUpdate(`education[${idx}].degree`, v)}
                      className="font-bold block w-full"
                      placeholder="Degree / Major"
                    />
                    <EditableText
                      value={edu.school}
                      onChange={(v) => onUpdate(`education[${idx}].school`, v)}
                      className="italic block text-sm w-full"
                      placeholder="School / University"
                    />
                    <div className="flex text-xs text-gray-500 gap-1 whitespace-nowrap">
                      <EditableText
                        value={edu.startYear}
                        onChange={(v) =>
                          onUpdate(`education[${idx}].startYear`, v)
                        }
                        placeholder="Start"
                      />
                      <span>-</span>
                      <EditableText
                        value={edu.endYear}
                        onChange={(v) =>
                          onUpdate(`education[${idx}].endYear`, v)
                        }
                        placeholder="End"
                      />
                    </div>
                  </SectionItemWrapper>
                ))}
              </SectionWrapper>
            </div>
          )}

          <div className="space-y-6 col-span-1">
            {isVisible("skills") && (
              <SectionWrapper
                title="Skills"
                onAdd={() =>
                  onAdd("skills", {
                    title: "New Category",
                    skills: ["Skill 1"],
                  })
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
                      className="font-bold text-xs uppercase text-gray-500 mb-1 w-full"
                      placeholder="CATEGORY"
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
                            className="text-sm leading-relaxed"
                          />
                          {/* Separator simulation */}
                          {sIdx < skillGroup.skills.length - 1 && (
                            <span className="text-gray-400 mr-1"></span>
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

            {isVisible("certifications") && data.certifications.length > 0 && (
              <SectionWrapper
                title="Certifications"
                onAdd={() => onAdd("certifications", "New Certification")}
                onHide={() => onToggleSection("certifications")}
                color={primaryColor}
              >
                <ul className="list-disc ml-4 space-y-1">
                  {data.certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm">
                      <SectionItemWrapper
                        onDelete={() => onRemove("certifications", idx)}
                      >
                        <EditableText
                          value={cert}
                          onChange={(v) => {
                            const newCerts = [...data.certifications];
                            newCerts[idx] = v;
                            onUpdate("certifications", newCerts);
                          }}
                          placeholder="Certification Name"
                        />
                      </SectionItemWrapper>
                    </li>
                  ))}
                </ul>
              </SectionWrapper>
            )}

            {isVisible("languages") && data.languages.length > 0 && (
              <SectionWrapper
                title="Languages"
                onAdd={() => onAdd("languages", "New Language")}
                onHide={() => onToggleSection("languages")}
                color={primaryColor}
              >
                <div className="flex flex-wrap gap-2 text-sm">
                  {data.languages.map((lang, idx) => (
                    <SectionItemWrapper
                      key={idx}
                      onDelete={() => onRemove("languages", idx)}
                    >
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        <EditableText
                          value={lang}
                          onChange={(v) => {
                            const newLangs = [...data.languages];
                            newLangs[idx] = v;
                            onUpdate("languages", newLangs);
                          }}
                          className="inline-block"
                        />
                      </span>
                    </SectionItemWrapper>
                  ))}
                </div>
              </SectionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
