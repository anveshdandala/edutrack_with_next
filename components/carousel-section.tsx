"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Briefcase, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import {motion} from "framer-motion";

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
  const [currentInternship, setCurrentInternship] = useState(0)
  const [currentEvent, setCurrentEvent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInternship((prev) => (prev + 1) % internships.length)
      setCurrentEvent((prev) => (prev + 1) % events.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const nextInternship = () => {
    setCurrentInternship((prev) => (prev + 1) % internships.length)
  }

  const prevInternship = () => {
    setCurrentInternship((prev) => (prev - 1 + internships.length) % internships.length)
  }

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev - 1 + events.length) % events.length)
  }

  return (
    <div className="space-y-4 py-[15px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Opportunities & Events</h2>
      </div>
<motion.div
      whileHover={{ scale: 1.03, y: -5 }} // 3. Add the scale and lift effect on hover
      transition={{ type: "spring", stiffness: 300, damping: 15 }} // 4. Make the animation smooth
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Approved Internships */}
        <Card>
          <CardContent className="p-6">
          <div className="h-[210px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Faculty Approved Internships</h3>
              </div>
              <div className=" flex gap-1">
                <Button variant="ghost" size="icon" onClick={prevInternship}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextInternship}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="h-[110px] space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{internships[currentInternship].title}</h4>
                  <p className="text-sm text-muted-foreground">{internships[currentInternship].company}</p>
                  <p className="text-sm">{internships[currentInternship].description}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  Approved
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">Duration: {internships[currentInternship].duration}</div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link href="/internships">
                <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  View All Internships
                </Button>
              </Link>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Upcoming College Events */}
        <Card>
          <CardContent className="p-6">
          <div className="h-[90px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Upcoming College Events</h3>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={prevEvent}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextEvent}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="h-[110px] space-y-3 ">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{events[currentEvent].title}</h4>
                  <p className="text-sm text-muted-foreground">{events[currentEvent].date}</p>
                  <p className="text-sm">{events[currentEvent].location}</p>
                </div>
                <Badge variant="outline">{events[currentEvent].type}</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link href="/events">
                <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
          </CardContent>
        </Card>
   
      </div>
     </motion.div>
    </div>
  )
}
