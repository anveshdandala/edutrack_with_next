"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Award,
  BarChart3,
  Building2,
  ChevronDown,
  FileBadge,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Network,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/institution/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Reports",
        href: "/institution/reports",
        icon: FileText,
        disabled: true,
      },
    ],
  },
  {
    id: "students",
    label: "Student Management",
    items: [
      {
        label: "All Students",
        href: "/institution/students",
        icon: GraduationCap,
        disabled: false,
      },
      {
        label: "Certificates",
        href: "/institution/students/certificates",
        icon: FileBadge,
        disabled: true,
      },
      {
        label: "Achievements",
        href: "/institution/students/achievements",
        icon: Award,
        disabled: true,
      },
      {
        label: "Student Resumes",
        href: "/institution/students/resumes",
        icon: FileText,
        disabled: true,
      },
      {
        label: "Student Analysis",
        href: "/institution/students/analysis",
        icon: BarChart3,
        disabled: true,
      },
    ],
  },
  {
    id: "departments",
    label: "Department & HOD Management",
    items: [
      {
        label: "Departments",
        href: "/institution/departments",
        icon: Network,
        disabled: false,
      },
      {
        label: "HODs",
        href: "/institution/departments/hods",
        icon: Users,
        disabled: true,
      },
    ],
  },
  {
    id: "settings",
    label: "Administration",
    items: [
      {
        label: "Settings",
        href: "/institution/settings",
        icon: Settings,
        disabled: true,
      },
    ],
  },
];

function NavItem({ item, pathname, onNavigate }) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname?.startsWith(`${item.href}/`);

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

export default function InstitutionShell({ children, user }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    user?.email ||
    "Institution user";

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">EduTrack</p>
            <p className="truncate text-xs text-muted-foreground">
              Institution
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="ml-auto flex size-9 items-center justify-center rounded-md border border-sidebar-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <SidebarNav pathname={pathname} />

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
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
              href="/institution/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Building2 className="size-5" aria-hidden="true" />
              EduTrack
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              title={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              {isDark ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Logout"
            >
              <LogOut className="size-4" aria-hidden="true" />
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
                <Building2 className="size-5" aria-hidden="true" />
                <span className="font-semibold">Institution</span>
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
          {children}
        </main>
      </div>
    </div>
  );
}
