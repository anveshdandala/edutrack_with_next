import { DashboardHeader } from "@/components/student/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const events = [
  {
    id: 1,
    title: "Annual Tech Symposium",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    type: "Conference",
    description:
      "Join industry leaders and students for a day of tech talks, workshops, and networking opportunities. Learn about the latest trends in technology and innovation.",
    capacity: "500 attendees",
    organizer: "Computer Science Department",
  },
  {
    id: 2,
    title: "Career Fair 2024",
    date: "March 22, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Student Center",
    type: "Career Event",
    description:
      "Meet with top employers and explore internship and full-time opportunities. Bring your resume and dress professionally for this networking event.",
    capacity: "1000 attendees",
    organizer: "Career Services",
  },
  {
    id: 3,
    title: "Research Presentation Day",
    date: "April 5, 2024",
    time: "1:00 PM - 6:00 PM",
    location: "Science Building",
    type: "Academic",
    description:
      "Students present their research projects and findings. A great opportunity to learn about ongoing research and connect with faculty members.",
    capacity: "300 attendees",
    organizer: "Research Office",
  },
  {
    id: 4,
    title: "Startup Pitch Competition",
    date: "April 12, 2024",
    time: "2:00 PM - 8:00 PM",
    location: "Innovation Hub",
    type: "Competition",
    description:
      "Watch student entrepreneurs pitch their startup ideas to a panel of investors and industry experts. Cash prizes and mentorship opportunities available.",
    capacity: "200 attendees",
    organizer: "Entrepreneurship Center",
  },
  {
    id: 5,
    title: "Alumni Networking Night",
    date: "April 20, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "University Club",
    type: "Networking",
    description:
      "Connect with successful alumni from various industries. Learn about career paths and build professional relationships over dinner and drinks.",
    capacity: "150 attendees",
    organizer: "Alumni Association",
  },
  {
    id: 6,
    title: "Hackathon 2024",
    date: "May 3-5, 2024",
    time: "48 hours",
    location: "Engineering Building",
    type: "Competition",
    description:
      "A 48-hour coding marathon where teams build innovative solutions to real-world problems. Prizes, mentorship, and fun activities throughout the event.",
    capacity: "400 participants",
    organizer: "ACM Student Chapter",
  },
];

export default function EventsPage() {
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
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Upcoming College Events
            </h1>
          </div>
          <p className="text-muted-foreground">
            Stay updated with the latest events, workshops, and activities
            happening on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              // 1. Make the Card a vertical flex container
              className="flex flex-col bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    {event.title}
                  </CardTitle>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
              </CardHeader>

              {/* 2. Make CardContent grow and act as a flex container */}
              <CardContent className="flex flex-col flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{event.capacity}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Organized by:{" "}
                    </span>
                    <span className="text-foreground">{event.organizer}</span>
                  </div>
                </div>

                {/* 3. Push the button to the bottom with an auto top margin */}
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
