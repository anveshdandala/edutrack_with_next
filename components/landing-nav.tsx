"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingNav() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CDP</span>
          </div>
          <span className="font-semibold text-lg">EduTrack</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#reports" className="text-muted-foreground hover:text-foreground transition-colors">
            Reports
          </Link>
          <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <Button asChild variant="outline">
            <Link href="/student">Sign In</Link>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="md:hidden">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </nav>
  )
}
