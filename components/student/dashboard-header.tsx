"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Settings, User, LogOut, Bell, Award, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  user?: {
    username?: string | null;
    email?: string | null;
  } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const UserPlaceholder = "/placeholder-user.jpg";
  const userInitials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "ST";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => router.push("/student/dashboard")}
        >
          <div className="bg-primary/10 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">EduTrack</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
            >
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {userInitials}
              </div>
              <Menu size={18} className="text-gray-600" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.username || "Alex Chen"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "Student ID: 23881A66F5"}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/student/profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2"
                >
                  <User size={16} /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <div className="border-t border-gray-50 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
