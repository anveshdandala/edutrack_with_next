"use client";
import Aurora from "@/components/react-bits/Aurora";
import "@/styles/professional-portfolio.css";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import TiltedCard from "@/components/react-bits/TiltedCard";
import LightRays from "@/components/react-bits/LightRays";
import Navgation from "@/components/react-bits/NavgationPort";
import SkillIcon from "@/components/react-bits/SkillIcon";
// Adjusted relative import for public asset
import GeminiImage from "../../../public/Gemini_Generated_Image_gf2jcmgf2jcmgf2j~2.jpg";
import { useState, useEffect } from "react";
import Dock from "@/components/react-bits/Dock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";
import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";

const AuroraDark = ({user}) => {
  const [hoveredSocial, setHoveredSocial] = useState(null);
    console.log("[AuroraDark]",user);
  // State for dynamic data
  const [portfolioData, setPortfolioData] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Portfolio Content
      const storedPortfolio = sessionStorage.getItem("ai_generated_portfolio");
    
      if (storedPortfolio) {
        try {
            console.log(storedPortfolio);
          setPortfolioData(JSON.parse(storedPortfolio));
        } catch (e) {
          console.error("Failed to parse portfolio data", e);
        }
      }

      // Load Resume Content (Personal Details)
      const storedResume = sessionStorage.getItem("ai_generated_resume");
        if (storedResume) {
        try {
            setResumeData(JSON.parse(storedResume));
        } catch(e) {
            console.error("Failed to parse resume data", e);
        }
      }
    }
  }, []);

  // --- Dynamic Data Mapping ---
  
  // Personal Details
  const personName = resumeData?.name || (user?.first_name ? `${user.first_name} ${user.last_name}` : "Your Name");
  const personTitle = resumeData?.position || "Full Stack Developer";
  const personBio = resumeData?.summary || "Passionate about creating innovative web solutions";
  const personEmail = resumeData?.email || user?.email || "hello@example.com";

  // Skills
  const skills = portfolioData?.skills?.map(s => typeof s === 'string' ? s : s.name) || ["React", "Next.js", "Python", "Node.js", "PostgreSQL", "Git"];
  
  const skillsData = portfolioData?.skills?.map(s => ({
      name: typeof s === 'string' ? s : s.name,
      icon: "🔹" 
  })) || [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "⏭️" },
    { name: "TypeScript", icon: "📘" },
    { name: "Python", icon: "🐍" },
    { name: "Node.js", icon: "🟢" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Git", icon: "🔧" },
    { name: "Docker", icon: "🐳" },
    { name: "AWS", icon: "☁️" },
    { name: "Tailwind CSS", icon: "🌊" },
  ];

  const items = [
    { icon: <VscHome size={18} />, label: "Home", onClick: () => {} },
    { icon: <VscArchive size={18} />, label: "Archive", onClick: () => {} },
    { icon: <VscAccount size={18} />, label: "Profile", onClick: () => {} },
    { icon: <VscSettingsGear size={18} />, label: "Settings", onClick: () => {} },
  ];

  // Certifications
  const certificate = portfolioData?.certifications?.map(c => ({
      title: c.name || "Certificate",
      image: "https://blog.loopcv.pro/content/images/2022/10/coursera-certificate-copy.jpg", 
      description: c.issuer || "Issued recently"
  })) || [];

  // Projects
  const projects = portfolioData?.projects?.map(p => ({
      title: p.title,
      description: p.description,
      github: p.link || "",
      preview: "/api/placeholder/400/250",
      image: "https://images.klipfolio.com/website/public/bf9c6fbb-06bf-4f1d-88a7-d02b70902bd1/data-dashboard.png"
  })) || [];

  // Social Media Mapping
  // Resume data usually has { platform, url } or just url
  // We'll try to map it to our icons
  const mapSocialIcon = (url) => {
      if(url.includes('github')) return Github;
      if(url.includes('linkedin')) return Linkedin;
      if(url.includes('twitter') || url.includes('x.com')) return Twitter; 
      if(url.includes('instagram')) return "Instagram"; // Using string as placeholder if icon missing
      return ExternalLink;
  }

  const socialLinks = resumeData?.socialMedia?.map(s => ({
      name: s.platform || "Social",
      icon: mapSocialIcon(s.url || ""),
      url: s.url,
      color: "hover:bg-blue-600 hover:text-white", // Default color
      bgColor: "bg-gray-900/20"
  })) || [
    { name: "GitHub", icon: Github, url: "https://github.com/", color: "hover:bg-gray-800 hover:text-white", bgColor: "bg-gray-900/20" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/", color: "hover:bg-blue-600 hover:text-white", bgColor: "bg-blue-600/20" }
  ];

  // Stats
  const certCount = certificate.length || 0;
  const projectCount = projects.length || 0;
  const expCount = resumeData?.workExperience?.length || 0;

  return (
    <>
      <div className="portfolio-container min-h-screen bg-black relative">
        <div className="absolute  inset-0 z-0">
          <Aurora
            colorStops={["#3a86ff", "#5ad1ff", "#c1d3fe"]}
            blend={0.6}
            amplitude={0.5}
            speed={0.5}
            className="mix-blend-overlay opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-portfolio-muted/90 to-portfolio-secondary/90"></div>
        <div className="relative z-20">
          <Navgation />

          {/* Hero Section */}
          <section className="relative z-10 container mx-auto px-6 py-32 min-h-screen flex items-center">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 w-full">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h1 className="text-5xl text-gray-200 md:text-7xl font-bold text-portfolio-text mb-6">
                  {personName}{" "}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 text-portfolio-text-light mb-8">
                  {personTitle}
                </p>

                <div className="skills-flex flex flex-wrap justify-center lg:justify-start gap-3">
                  {skills.slice(0, 6).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="each-skill bg-white/80 text-portfolio-text border-0 hover:bg-white transition-colors px-4 py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <TiltedCard
                  imageSrc={GeminiImage.src}
                  altText={`${personName} portfolio`}
                  captionText={`${personName} - Dev`}
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  showMobileWarning={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text">{personName} - Dev </p>
                  }
                />
              </div>
            </div>
          </section>
        </div>

        <section className="emp-section min-h-full bg-black" id="about-me">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center gap-16">
            <div className="flex-1">
              <SpotlightCard className="p-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  About Me
                </h2>
                <p className="text-xl leading-relaxed text-slate-300">
                  {personBio}
                </p>
              </SpotlightCard>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    Certificates
                  </h3>
                  <p className="text-base text-blue-200">
                    Earned certifications
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-blue-400">{certCount}</h3>
              </SpotlightCard>

              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    Projects
                  </h3>
                  <p className="text-base text-green-200">
                    Completed projects
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-green-400">{projectCount}</h3>
              </SpotlightCard>

              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">
                    Experience
                  </h3>
                  <p className="text-base text-yellow-200">
                    Job experiences
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-yellow-400">{expCount}</h3>
              </SpotlightCard>
            </div>
          </div>
        </section>

        <section
          className="section-3 bg-black relative min-h-screen overflow-hidden"
          id="archievements"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
              <LightRays
                raysOrigin="left"
                raysColor="#00ffff"
                raysSpeed={1.5}
                lightSpread={0.8}
                rayLength={1.2}
                followMouse={true}
                mouseInfluence={0.1}
                noiseAmount={0.1}
                distortion={0.05}
                className="custom-rays w-full h-full"
              />
            </div>
          </div>

          <div className="container mx-auto px-6 py-20 relative z-10">
            <Tabs defaultValue="projects" className="max-w-6xl mx-auto py-10">
              <TabsList className="w-full max-w-lg mx-auto mb-16 flex items-center justify-center gap-x-2 p-2 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
                <TabsTrigger value="projects" className="px-4 py-2 text-base font-medium text-white/70 rounded-full transition-colors duration-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="certificates" className="px-4 py-2 text-base font-medium text-white/70 rounded-full transition-colors duration-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                  Certificates
                </TabsTrigger>
                <TabsTrigger value="skills" className="px-4 py-2 text-base font-medium text-white/70 rounded-full transition-colors duration-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                  Skills
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects">
                <div className="grid md:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <Card
                      key={index}
                      className="bg-black/50 backdrop-blur-md border border-white/10 shadow-lg rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:border-white/20"
                    >
                      <CardHeader>
                        <div className="w-full h-48 bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle className="text-xl text-white">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-300 mb-4 line-clamp-3 min-h-[72px]">
                          {project.description}
                        </CardDescription>
                        {project.github && (
                            <Link href={project.github} target="_blank">
                                <Button variant="outline" className="w-full border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white">
                                <Github className="w-4 h-4 mr-2" /> View on GitHub
                                </Button>
                            </Link>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="certificates">
                <div className="grid md:grid-cols-3 gap-8">
                  {certificate.map((cert, index) => (
                    <Card
                      key={index}
                      className="bg-black/50 backdrop-blur-md border border-white/10 shadow-lg rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:border-white/20 overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="w-full h-56 bg-gray-800/50 flex items-center justify-center">
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-1">{cert.title}</h3>
                          <p className="text-gray-300 text-center min-h-[48px]">
                            {cert.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                  {skillsData.map((skill, index) => (
                    <SkillIcon
                      key={skill.name || index}
                      name={skill.name}
                      icon={skill.icon}
                      className="animate-slide-up"
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="contact" className="relative bg-gradient-to-b from-[#181e37] to-[#000] py-32 textured-bg">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-200 mb-6">
                Let's Connect
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Ready to collaborate?
              </p>
              <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-btn group ${social.color} ${social.bgColor} transition-all duration-300 hover:scale-110 hover:shadow-2xl relative`}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className="flex flex-col items-center space-y-3">
                         {/* Check if IconComponent is a function or string */}
                        {typeof IconComponent === 'function' || typeof IconComponent === 'object' ? (
                             <IconComponent
                             size={32}
                             className={`transition-all duration-300 ${
                               hoveredSocial === social.name
                                 ? "scale-110 rotate-12"
                                 : ""
                             } text-gray-300 group-hover:text-white`}
                           />
                        ) : (
                            <span className="text-2xl">{IconComponent}</span>
                        )}
                       
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                          {social.name}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
                    </a>
                  );
                })}
              </div>

              <div className="inline-flex items-center space-x-3 text-gray-400 hover:text-portfolio-accent transition-colors duration-300 cursor-pointer group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg text-gray-200">{personEmail}</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-gray-300/10 py-8 textured-bg">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-200">
              © {new Date().getFullYear()} {personName}. Built with React & AI.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
export default AuroraDark;
