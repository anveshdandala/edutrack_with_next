"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Briefcase, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, type FC, type ComponentType, type SVGProps } from "react"
import Link from "next/link"
import {motion, AnimatePresence} from "framer-motion";
import { Clock, MapPin, ArrowUpRight } from "lucide-react"

const internships = [
  {
    id: 1,
    title: "Software Development Intern",
    company: "Tech Corp",
    duration: "3 months",
    status: "approved",
    description: "Full-stack development with React and Node.js",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Analytics Inc",
    duration: "6 months",
    status: "approved",
    description: "Machine learning and data analysis projects",
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Design Studio",
    duration: "4 months",
    status: "approved",
    description: "User interface design and user experience research",
  },
]

const events = [
  {
    id: 1,
    title: "Annual Tech Symposium",
    date: "March 15, 2024",
    location: "Main Auditorium",
    type: "Conference",
  },
  {
    id: 2,
    title: "Career Fair 2024",
    date: "March 22, 2024",
    location: "Student Center",
    type: "Career Event",
  },
  {
    id: 3,
    title: "Research Presentation Day",
    date: "April 5, 2024",
    location: "Science Building",
    type: "Academic",
  },
]

export function CarouselSection() {
const [activeInternship, setActiveInternship] = useState(0);
  const [activeEvent, setActiveEvent] = useState(0);

  const internships = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Google",
      type: "Remote",
      tags: ["React", "Node.js"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Spotify",
      type: "New York",
      tags: ["Python", "ML"],
      color: "from-green-500 to-emerald-500",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Annual Tech Summit",
      date: "Mar 15, 2024",
      time: "10:00 AM",
      location: "Main Auditorium",
    },
    {
      id: 2,
      title: "Career Fair 2024",
      date: "Mar 22, 2024",
      time: "09:00 AM",
      location: "Campus Grounds",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveInternship((prev) => (prev + 1) % internships.length);
      setActiveEvent((prev) => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [internships.length, events.length]);

  type CardHeaderActionProps = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    link: string;
  };

  const CardHeaderAction: FC<CardHeaderActionProps> = ({ icon: Icon, title, link }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <Link href={link}>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
          View All <ArrowUpRight className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      
      {/* Internships Widget */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <CardHeaderAction icon={Briefcase} title="Internships" link="/internships" />
          
          <div className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInternship}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-muted/30 rounded-xl p-5 border border-border/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{internships[activeInternship].title}</h4>
                    <p className="text-muted-foreground font-medium">{internships[activeInternship].company}</p>
                  </div>
                  <Badge variant="secondary">{internships[activeInternship].type}</Badge>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {internships[activeInternship].tags.map(tag => (
                    <span key={tag} className="text-xs bg-background px-2 py-1 rounded-md border shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between items-center mt-4">
               <div className="flex gap-1">
                {internships.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeInternship ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} 
                    />
                ))}
               </div>
               <div className="flex gap-1">
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveInternship(prev => (prev - 1 + internships.length) % internships.length)}>
                    <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveInternship(prev => (prev + 1) % internships.length)}>
                    <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Widget */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <CardHeaderAction icon={Calendar} title="Upcoming Events" link="/events" />
          
          <div className="relative min-h-[180px]">
             <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/5 rounded-xl p-5 border border-primary/10"
              >
                <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Next Event</span>
                    <h4 className="font-bold text-lg">{events[activeEvent].title}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{events[activeEvent].date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{events[activeEvent].time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                        <MapPin className="h-4 w-4" />
                        <span>{events[activeEvent].location}</span>
                    </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-4">
               <div className="flex gap-1">
                {events.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeEvent ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} 
                    />
                ))}
               </div>
               <div className="flex gap-1">
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveEvent(prev => (prev - 1 + events.length) % events.length)}>
                    <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveEvent(prev => (prev + 1) % events.length)}>
                    <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}