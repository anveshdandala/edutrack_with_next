"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";
import StudentAnalytics from "@/components/student/dashboard/StudentAnalytics";
import StudentChatWidget from "@/components/student/StudentChatWidget";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/student", icon: LayoutDashboard },
      { label: "Profile", href: "/student/profile", icon: User, disabled: true },
      {
        label: "Certificates",
        href: "/student/certificates",
        icon: Award,
      },
      { label: "Resume", href: "/student/resume", icon: FileText },
      {
        label: "Portfolio",
        href: "/student/portfolio",
        icon: Briefcase,
      },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      { label: "Analytics", href: "/student/analytics", icon: BarChart3 },
      { label: "Opportunities", href: "/student/internships", icon: Briefcase, disabled: true },
      { label: "Settings", href: "/student/settings", icon: Settings, disabled: true },
    ],
  },
];

function getDisplayName(user) {
  return (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Student"
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function NavItem({ item, pathname, onNavigate }) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/student" && pathname?.startsWith(`${item.href}/`));

  if (item.disabled) {
    return (
      <div
        className="flex h-9 cursor-not-allowed items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground/60"
        title="Coming soon"
        aria-disabled="true"
      >
        <Icon className="size-4" aria-hidden="true" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarNav({ pathname, onNavigate }) {
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(navGroups.map((group) => [group.id, true])),
  );

  return (
    <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => {
        const isOpen = openGroups[group.id];

        return (
          <section key={group.id} className="space-y-1">
            <button
              type="button"
              onClick={() =>
                setOpenGroups((current) => ({
                  ...current,
                  [group.id]: !current[group.id],
                }))
              }
              className="flex h-8 w-full items-center justify-between rounded-md px-3 text-xs font-semibold uppercase text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-expanded={isOpen}
            >
              <span className="truncate">{group.label}</span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  isOpen ? "rotate-180" : "rotate-0",
                )}
                aria-hidden="true"
              />
            </button>

            {isOpen ? (
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </nav>
  );
}

function ThemeButton({ isDark, setTheme }) {
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex size-9 items-center justify-center rounded-md border border-sidebar-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

function StatTile({ label, value, detail, icon: Icon }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md border bg-card p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{title}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {description}
          </span>
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

export default function StudentDashboardUI({
  user,
  tenant,
  certificatesSlot,
  internshipsSlot,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const displayName = getDisplayName(user);
  const userEmail = user?.email || "student@example.com";
  const initials = getInitials(displayName);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">EduTrack</p>
            <p className="truncate text-xs text-muted-foreground">Student</p>
          </div>
          <ThemeButton isDark={isDark} setTheme={setTheme} />
        </div>

        <SidebarNav pathname={pathname} />

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-sidebar-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Open navigation"
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>
            <Link
              href="/student"
              className="flex items-center gap-2 font-semibold"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
              EduTrack
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeButton isDark={isDark} setTheme={setTheme} />
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              aria-label="Close navigation"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
              <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
                <GraduationCap className="size-5" aria-hidden="true" />
                <span className="font-semibold">Student</span>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="ml-auto flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Close navigation"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <SidebarNav
                pathname={pathname}
                onNavigate={() => setIsMobileNavOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {displayName}. Track achievements, skills, and career readiness.
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Bell className="size-4" aria-hidden="true" />
                Notifications
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <section className="space-y-4">
              <div className="rounded-md border bg-card p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="flex size-20 items-center justify-center rounded-md bg-primary/10 text-2xl font-bold text-primary">
                    {initials}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>

                <div className="mt-5 space-y-3 rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Roll No.</span>
                    <span className="font-medium">
                      {user?.roll_number || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">
                      {user?.department || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Semester</span>
                    <span className="font-medium">
                      {user?.current_semester || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Activity className="size-4 text-primary" aria-hidden="true" />
                    Activity Score
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Top 15%
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">90</span>
                  <span className="mb-1 text-sm text-muted-foreground">/100</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[85%] rounded-full bg-primary" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Internship</span>
                    <span className="font-medium">+200 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symposium</span>
                    <span className="font-medium text-primary">Pending</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <ActionButton
                  icon={Briefcase}
                  title="Career Portfolio"
                  description="View and generate"
                  onClick={() =>
                    router.push("/student/portfolio")
                  }
                />
                <ActionButton
                  icon={FileText}
                  title="Build Resume"
                  description="ATS-friendly templates"
                  onClick={() => router.push("/student/resume")}
                />
                <ActionButton
                  icon={Sparkles}
                  title="Talent Insights"
                  description="Skills and growth signals"
                  onClick={() => router.push("/student/analytics")}
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatTile
                  label="Certificates"
                  value="12"
                  detail="Verified and pending records"
                  icon={Award}
                />
                <StatTile
                  label="Career Readiness"
                  value="84%"
                  detail="Based on profile completeness"
                  icon={BarChart3}
                />
                <StatTile
                  label="Upcoming Events"
                  value="2"
                  detail="Scheduled campus activities"
                  icon={Calendar}
                />
              </div>

              <StudentAnalytics tenant={tenant} />

              <section className="rounded-md border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Recent Certificates</h2>
                    <p className="text-sm text-muted-foreground">
                      Latest uploaded credentials and verification status.
                    </p>
                  </div>
                  <Link href="/student/certificates">
                    <Button variant="outline" size="sm">
                      view more
                    </Button>
                  </Link>
                </div>
                {certificatesSlot}
              </section>

              <section className="rounded-md border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Internships</h2>
                    <p className="text-sm text-muted-foreground">
                      Opportunities and recent career activity.
                    </p>
                  </div>
                </div>
                {internshipsSlot}
              </section>

              <section className="rounded-md border bg-card p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="size-5 text-primary" aria-hidden="true" />
                  Events
                </h2>
                <div className="grid gap-4 xl:grid-cols-2">
                  {[
                    [
                      "Mar",
                      "22",
                      "University Career Fair 2024",
                      "09:00 AM",
                      "Campus Grounds",
                    ],
                    [
                      "Apr",
                      "05",
                      "Hackathon: Code for Good",
                      "10:00 AM",
                      "Innovation Hub",
                    ],
                  ].map(([month, day, title, time, place]) => (
                    <div
                      key={title}
                      className="flex gap-4 rounded-md border bg-background p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="text-xs font-semibold uppercase">{month}</span>
                        <span className="text-xl font-bold">{day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {time} - {place}
                        </p>
                      </div>
                      <ChevronRight className="mt-5 size-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </main>
      </div>

      <StudentChatWidget user={user} tenant={tenant} />
    </div>
  );
}
