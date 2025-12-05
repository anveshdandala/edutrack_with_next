"use client";
import Aurora from "@/components/react-bits/Aurora";
import "@/styles/professional-portfolio.css";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import TiltedCard from "@/components/react-bits/TiltedCard";
import LightRays from "@/components/react-bits/LightRays";
import Navgation from "@/components/react-bits/NavgationPort";
import SkillIcon from "@/components/react-bits/SkillIcon";
import GeminiImage from "../../../../../public/Gemini_Generated_Image_gf2jcmgf2jcmgf2j~2.jpg";
import { useState } from "react";
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

const ProfessionalPortfolio = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);
  // Skill data
  const skills = ["React", "Next.js", "Python", "Node.js", "PostgreSQL", "Git"];

  const skillsData = [
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
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <VscArchive size={18} />,
      label: "Archive",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Profile",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];

  // Project data
  const certificate = [
    {
      title: "Full Stack Web Development",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkAF9HllQHFZeF86dX4_Goo3X3asZKFacx3Q&s",
      description: "NPTEL - Issued June 2023",
    },
    {
      title: "Data Science Professional",
      image:
        "https://miro.medium.com/v2/resize:fit:1400/1*dPbnzOzWwrsmLCcZaY4ctw.jpeg",
      description: "ORACLE - Issued June 2023",
    },
    {
      title: "Introduction to Machine Learning",
      image:
        "https://blog.loopcv.pro/content/images/2022/10/coursera-certificate-copy.jpg",
      description: "Coursera - Issued June 2023",
    },
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      github: "",
      preview: "/api/placeholder/400/250",
      image:
        "https://marketplace.canva.com/EAGkJu6RBag/1/0/1600w/canva-pink-and-white-minimalist-e-commerce-presentation-pUrMakjsI6U.jpg",
    },
    {
      title: "Task Management App",
      description:
        "Collaborative task management application built with Next.js and TypeScript. Real-time updates using WebSocket connections.",
      github: "",
      preview: "/api/placeholder/400/250",
      image: "https://www.dragapp.com/wp-content/uploads/2024/02/IT-1.png",
    },
    {
      title: "Data Visualization Dashboard",
      description:
        "Interactive dashboard for data analysis using React, D3.js, and Python backend. Handles large datasets with efficient caching.",
      github: "",
      preview: "/api/placeholder/400/250",
      image:
        "https://images.klipfolio.com/website/public/bf9c6fbb-06bf-4f1d-88a7-d02b70902bd1/data-dashboard.png",
    },
  ];
  const socialLinks = [
    {
      name: "GitHub",
      icon: Mail,
      url: "https://github.com/",
      color: "hover:bg-gray-800 hover:text-white",
      bgColor: "bg-gray-900/20",
    },
    {
      name: "LinkedIn",
      icon: Mail,
      url: "https://linkedin.com/",
      color: "hover:bg-blue-600 hover:text-white",
      bgColor: "bg-blue-600/20",
    },
    {
      name: "Twitter",
      icon: Mail,
      url: "https://twitter.com/",
      color: "hover:bg-blue-400 hover:text-white",
      bgColor: "bg-blue-400/20",
    },
    {
      name: "Instagram",
      icon: "Mail",
      url: "https://instagram.com/",
      color: "hover:bg-pink-600 hover:text-white",
      bgColor: "bg-pink-600/20",
    },
  ];

  return (
    <>
      {/* I've changed the background on this root div to `bg-black` for a dark base */}
      <div className="portfolio-container min-h-screen bg-black relative">
        {/* Aurora background */}
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
          {/* Centered Glassmorphism Navbar */}
          <Navgation />

          {/* Hero Section */}
          <section className="relative z-10 container mx-auto px-6 py-32 min-h-screen flex items-center">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 w-full">
              {/* Content Side - Left */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h1 className="text-5xl text-gray-200 md:text-7xl font-bold text-portfolio-text mb-6">
                  Priya Mohan{" "}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 text-portfolio-text-light mb-8">
                  Full Stack Developer passionate about creating innovative web
                  solutions
                </p>

                {/* Skills */}
                <div className="skills-flex flex flex-wrap justify-center lg:justify-start gap-3">
                  {skills.map((skill) => (
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

              {/* Profile Side - Right */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <TiltedCard
                  imageSrc={GeminiImage.src}
                  altText="Priya portfolo image"
                  captionText="Priya Mohan - Dev"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                  showMobileWarning={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <p className="tilted-card-demo-text">Priya Mohan - Dev </p>
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {/* Scroll Section 1 - Added `bg-black` here for a seamless transition */}
        <section className="emp-section min-h-full bg-black" id="about-me">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center gap-16">
            {/* Left Spotlight Card */}
            <div className="flex-1">
              <SpotlightCard className="p-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Passionate about building scalable web applications
                </h2>
                <p className="text-xl leading-relaxed text-slate-300">
                  I specialize in creating scalable and modern web applications,
                  solving complex data challenges, and building clean,
                  maintainable code with modern best practices and cutting-edge
                  technologies.
                </p>
              </SpotlightCard>
            </div>

            {/* Right Column Stats */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Certificates Card */}
              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    Certificates
                  </h3>
                  <p className="text-base text-blue-200">
                    Earned 12 professional certifications
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-blue-400">12</h3>
              </SpotlightCard>

              {/* Projects Card */}
              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    Projects
                  </h3>
                  <p className="text-base text-green-200">
                    Completed 8 full-stack projects
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-green-400">8</h3>
              </SpotlightCard>

              {/* Experience Card */}
              <SpotlightCard className="flex justify-between items-center p-8 card-hover-effect">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">
                    Experience
                  </h3>
                  <p className="text-base text-yellow-200">
                    3 years of hands-on development
                  </p>
                </div>
                <h3 className="text-5xl font-bold text-yellow-400">3</h3>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Scroll Section 2 - Removed `bg-portfolio-muted` and added `bg-black` to keep it dark */}
        <section
          className="section-3 bg-black relative min-h-screen overflow-hidden"
          id="archievements"
        >
          {/* LightRays Background */}
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
              {/* Navigation */}
              <TabsList className="w-full max-w-lg mx-auto mb-16 flex items-center justify-center gap-x-2 p-2 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
                <TabsTrigger
                  value="projects"
                  className="px-4 py-2 text-base font-medium text-white/70 rounded-full transition-colors duration-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>

                <TabsTrigger
                  value="certificates"
                  className="px-4 py-2 text-base font-medium text-white/70 rounded-full transition-colors duration-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Certificates
                </TabsTrigger>

                <TabsTrigger
                  value="skills"
                  className="
      px-4 py-2                          
      text-base font-medium text-white/70   
      rounded-full                       
      transition-colors duration-300       
      hover:text-white hover:bg-white/10  
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
      data-[state=active]:bg-white/10     
      data-[state=active]:text-white      
    "
                >
                  Skills
                </TabsTrigger>
              </TabsList>
              {/* Projects Tab */}
              <TabsContent value="projects">
                <div className="grid md:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <Card
                      key={index}
                      // --- HOVER EFFECTS ADDED ---
                      // A smooth transition for all changes
                      // Scale up to 105% on hover
                      // A more pronounced shadow on hover to make it "lift"
                      className="
            bg-black/50 backdrop-blur-md border border-white/10
            shadow-lg rounded-xl
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-2xl hover:border-white/20
          "
                    >
                      <CardHeader>
                        {/* Added object-cover to ensure the image fills the container */}
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
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 bg-gray-700 text-gray-400 hover:bg-gray-700 cursor-not-allowed"
                          disabled
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View on GitHub
                        </Button>
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
                      // --- HOVER EFFECTS ADDED (Consistent with projects) ---
                      className="
            bg-black/50 backdrop-blur-md border border-white/10
            shadow-lg rounded-xl
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-2xl hover:border-white/20
            overflow-hidden
          "
                    >
                      <CardContent className="p-0">
                        {/* Container for the image */}
                        <div className="w-full h-56 bg-gray-800/50 flex items-center justify-center">
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="w-full h-full object-contain p-4" // Use object-contain for certificates
                          />
                        </div>
                        {/* Container for the text content */}
                        <div className="p-6">
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
                      key={skill.name}
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

        <section
          id="contact"
          className="relative bg-gradient-to-b from-[#181e37] to-[#000] py-32 textured-bg"
        >
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-200 mb-6">
                Let's Connect
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Ready to collaborate on something amazing? I'm always excited to
                work on innovative projects and connect with fellow developers
                and creators.
              </p>
              <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />

              {/* Enhanced Social Media Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-btn group ${social.color} ${social.bgColor} transition-all duration-300 hover:scale-110 hover:shadow-2xl relative`}
                      onMouseEnter={() => setHoveredSocial(social.name)}
                      onMouseLeave={() => setHoveredSocial(null)}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <IconComponent
                          size={32}
                          className={`transition-all duration-300 ${
                            hoveredSocial === social.name
                              ? "scale-110 rotate-12"
                              : ""
                          } text-gray-300 group-hover:text-white`}
                        />
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                          {social.name}
                        </span>
                      </div>

                      {/* Ripple effect */}
                      <div className="absolute inset-0 rounded-xl bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
                    </a>
                  );
                })}
              </div>

              {/* Email Contact */}
              <div className="inline-flex items-center space-x-3 text-gray-400 hover:text-portfolio-accent transition-colors duration-300 cursor-pointer group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg text-gray-200">hello@johndoe.dev</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-300/10 py-8 textured-bg">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-200">
              © 2024 John Doe. Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
export default ProfessionalPortfolio;
