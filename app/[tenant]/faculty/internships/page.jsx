"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus, Search } from "lucide-react";

// Extended mock data for internships/events
const allInternshipsEvents = [
  {
    id: 1,
    title: "Google Summer of Code 2024",
    description:
      "Open source development program for students worldwide. Work on real projects with mentorship.",
    type: "internship",
    category: "Software Development",
    deadline: "2024-03-15",
  },
  {
    id: 2,
    title: "Tech Conference 2024",
    description:
      "Annual technology conference with industry leaders discussing latest trends in AI and ML.",
    type: "event",
    category: "Conference",
    deadline: "2024-04-20",
  },
  {
    id: 3,
    title: "Microsoft Internship Program",
    description:
      "Software engineering internship opportunity at Microsoft with full-time conversion potential.",
    type: "internship",
    category: "Software Development",
    deadline: "2024-02-28",
  },
  {
    id: 4,
    title: "AI Workshop Series",
    description:
      "Hands-on workshop series on artificial intelligence and machine learning fundamentals.",
    type: "event",
    category: "Workshop",
    deadline: "2024-03-10",
  },
  {
    id: 5,
    title: "Amazon SDE Internship",
    description:
      "Software Development Engineer internship at Amazon with competitive compensation.",
    type: "internship",
    category: "Software Development",
    deadline: "2024-03-01",
  },
  {
    id: 6,
    title: "Startup Pitch Competition",
    description:
      "Annual startup pitch competition for students with cash prizes and mentorship opportunities.",
    type: "event",
    category: "Competition",
    deadline: "2024-04-15",
  },
  {
    id: 7,
    title: "Data Science Bootcamp",
    description:
      "Intensive 3-day bootcamp covering data science tools and techniques.",
    type: "event",
    category: "Workshop",
    deadline: "2024-03-25",
  },
  {
    id: 8,
    title: "Goldman Sachs Technology Analyst",
    description:
      "Technology analyst internship program at Goldman Sachs focusing on fintech solutions.",
    type: "internship",
    category: "Finance Technology",
    deadline: "2024-02-20",
  },
];

export default function FacultyInternships() {
  const [recommendations, setRecommendations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleRecommendation = (id, action) => {
    setRecommendations((prev) => ({
      ...prev,
      [id]: action,
    }));
  };

  const filteredItems = allInternshipsEvents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={false} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/faculty">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Internships & Events Management
            </h1>
            <p className="text-muted-foreground">
              Manage and recommend opportunities for your students
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search internships and events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "internship" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("internship")}
            >
              Internships
            </Button>
            <Button
              variant={filterType === "event" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("event")}
            >
              Events
            </Button>
          </div>
          <Button>Add New College Tech Event</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Total Opportunities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.values(recommendations).filter((r) => r === "positive")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Recommended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {
                  Object.values(recommendations).filter((r) => r === "negative")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Discarded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {
                  filteredItems.filter((item) => item.type === "internship")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Internships</p>
            </CardContent>
          </Card>
        </div>

        {/* Internships & Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <Badge
                    variant={
                      item.type === "internship" ? "default" : "secondary"
                    }
                  >
                    {item.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span>{item.deadline}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant={
                      recommendations[item.id] === "positive"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleRecommendation(item.id, "positive")}
                    className="flex-1"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Recommend
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      recommendations[item.id] === "negative"
                        ? "destructive"
                        : "outline"
                    }
                    onClick={() => handleRecommendation(item.id, "negative")}
                    className="flex-1"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    Discard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No internships or events found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
