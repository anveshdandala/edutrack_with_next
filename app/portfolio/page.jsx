import { DashboardHeader } from "@/components/dashboard-header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Briefcase } from "lucide-react";

const Portfolio = () => {
  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gradient-to-br from-portfolio-muted to-portfolio-secondary">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-6">
              Choose Your Portfolio
            </h1>
            <p className="text-xl text-portfolio-text-light max-w-2xl mx-auto">
              Select the type of portfolio you'd like to explore
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional Portfolio Card */}
            <Link rel="stylesheet" href="/portfolio/professional-portfolio">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:scale-105 bg-gradient-to-br from-white to-portfolio-secondary border-0">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-portfolio-accent/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-portfolio-accent/20 transition-colors">
                    <Briefcase className="w-8 h-8 text-portfolio-accent" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-portfolio-text">
                    Professional Portfolio
                  </CardTitle>
                  <CardDescription className="text-portfolio-text-light text-lg">
                    Showcasing technical skills, projects, and professional
                    experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-portfolio-text-light mb-6">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Technical projects and code repositories
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Professional certifications
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Skills and technologies
                    </li>
                  </ul>
                  <Button className="w-full bg-portfolio-accent hover:bg-portfolio-accent/90 text-white">
                    View Professional Portfolio
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Personal Portfolio Card */}
            <Link rel="stylesheet" href="/portfolio/personal-portfolio">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:scale-105 bg-gradient-to-br from-white to-portfolio-secondary border-0">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-portfolio-accent/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-portfolio-accent/20 transition-colors">
                    <User className="w-8 h-8 text-portfolio-accent" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-portfolio-text">
                    Personal Portfolio
                  </CardTitle>
                  <CardDescription className="text-portfolio-text-light text-lg">
                    Get your performance insights over time and track your
                    growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-portfolio-text-light mb-6">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Personal projects and hobbies
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Creative work and achievements
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-portfolio-accent rounded-full mr-3"></div>
                      Personal interests and goals
                    </li>
                  </ul>

                  <Button
                    variant="outline"
                    className="w-full border-portfolio-accent text-portfolio-accent hover:bg-portfolio-accent/10"
                  >
                    View Personal Portfolio
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
