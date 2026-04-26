import Link from "next/link";

const MOCK_INTERNSHIPS = [
  {
    id: 101,
    title: "Data Science Intern",
    company: "Spotify",
    location: "New York (Remote)",
    logoBg: "bg-black",
    logoColor: "bg-blue-500",
    tags: ["Python", "ML"],
  },
  {
    id: 102,
    title: "Backend Developer",
    company: "TechCorp",
    location: "Hyderabad",
    logoBg: "bg-blue-600",
    logoText: "T",
    tags: ["Django"],
  },
];

export default async function RecentInternships() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {MOCK_INTERNSHIPS.map((intern) => (
        <div
          key={intern.id}
          className="group flex cursor-pointer flex-col items-start justify-between gap-4 rounded-md border bg-background p-5 transition-colors hover:bg-accent sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-md text-xl font-bold text-white ${intern.logoBg}`}
            >
              {intern.logoText ? (
                intern.logoText
              ) : (
                <div className={`size-6 rounded-full ${intern.logoColor}`} />
              )}
            </div>
            <div>
              <h4 className="font-bold text-foreground transition-colors group-hover:text-accent-foreground">
                {intern.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {intern.company} · {intern.location}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <div className="flex gap-2">
              {intern.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/student/internships"
              className="whitespace-nowrap rounded-md bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
