import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  Building,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const internships = [
  {
    id: 1,
    title: "Software Development Intern",
    company: "Tech Corp",
    duration: "3 months",
    status: "approved",
    description:
      "Full-stack development with React and Node.js. Work on real-world projects and gain hands-on experience with modern web technologies.",
    location: "San Francisco, CA",
    startDate: "June 2024",
    requirements: ["React", "Node.js", "JavaScript", "Git"],
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Analytics Inc",
    duration: "6 months",
    status: "approved",
    description:
      "Machine learning and data analysis projects. Analyze large datasets and build predictive models using Python and R.",
    location: "New York, NY",
    startDate: "July 2024",
    requirements: ["Python", "R", "Machine Learning", "Statistics"],
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Design Studio",
    duration: "4 months",
    status: "approved",
    description:
      "User interface design and user experience research. Create wireframes, prototypes, and conduct user testing.",
    location: "Austin, TX",
    startDate: "August 2024",
    requirements: [
      "Figma",
      "Adobe Creative Suite",
      "User Research",
      "Prototyping",
    ],
  },
  {
    id: 4,
    title: "Mobile App Development Intern",
    company: "Mobile Solutions",
    duration: "5 months",
    status: "approved",
    description:
      "Develop cross-platform mobile applications using React Native and Flutter. Work with APIs and mobile-specific features.",
    location: "Seattle, WA",
    startDate: "September 2024",
    requirements: [
      "React Native",
      "Flutter",
      "Mobile Development",
      "API Integration",
    ],
  },
  {
    id: 5,
    title: "Cybersecurity Intern",
    company: "SecureNet",
    duration: "6 months",
    status: "approved",
    description:
      "Learn about network security, penetration testing, and security audits. Assist in identifying and mitigating security vulnerabilities.",
    location: "Washington, DC",
    startDate: "October 2024",
    requirements: [
      "Network Security",
      "Penetration Testing",
      "Linux",
      "Security Auditing",
    ],
  },
  {
    id: 6,
    title: "Cloud Engineering Intern",
    company: "CloudTech",
    duration: "4 months",
    status: "approved",
    description:
      "Work with AWS, Azure, and Google Cloud platforms. Learn about containerization, microservices, and DevOps practices.",
    location: "Denver, CO",
    startDate: "November 2024",
    requirements: ["AWS", "Docker", "Kubernetes", "DevOps"],
  },
];

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/student">
            <Button variant="ghost" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Faculty Approved Internships
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explore internship opportunities that have been reviewed and
            approved by our faculty members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <Card
              key={internship.id}
              // 1. Removed h-[450px] and added flexbox classes
              className="flex flex-col bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    {internship.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    Approved
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {internship.company}
                </div>
              </CardHeader>

              {/* 2. Added flexbox classes to make this section grow */}
              <CardContent className="flex flex-col flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {internship.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Duration: {internship.duration}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Location: </span>
                    <span className="text-foreground">
                      {internship.location}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Start Date: </span>
                    <span className="text-foreground">
                      {internship.startDate}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Requirements:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {internship.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 3. Added mt-auto to push the button to the bottom */}
                <Button className="w-full flex items-center gap-2 mt-auto">
                  <ExternalLink className="h-4 w-4" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
