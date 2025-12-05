export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  title: string;
  link: string;
  description: string;
  technologies: string[];
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface ResumeData {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  contactInformation: string; // Keeps consistency with provided JSON
  summary: string;
  profilePicture: string;
  socialMedia: SocialMedia[];
  skills: SkillGroup[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  languages: string[];
  certifications: string[];
}

export interface Settings {
  primaryColor: string;
  fontSize: number;
  fontFamily: string;
  columns: number;
  hiddenSections: string[];
  leftColumnWidth: number; // Percentage width of the left column (for 2-col layouts)
}

export interface TemplateProps {
  data: ResumeData;
  onUpdate: (path: string, value: any) => void;
  onAdd: (section: keyof ResumeData, item: any) => void;
  onRemove: (section: keyof ResumeData, index: number) => void;
  settings: Settings;
  onToggleSection: (section: string) => void;
  onSettingsUpdate: (key: keyof Settings, value: any) => void;
}