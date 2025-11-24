"use client"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import GeminiImage from "../public/Gemini_Generated_Image_gf2jcmgf2jcmgf2j~2.jpg"
import { GraduationCap, Settings, User, LogOut } from "lucide-react"
import useAuth from "./useAuth"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 pl-[60px] pr-[60px] z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold"
          >EduTrack</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
              src={GeminiImage}
              alt="user image "
              width={40}
                height={40}
                className="rounded-full"
              >
              </Image>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              onClick={()=>{router.push("/student/profile")}}
              >
                Profile
                </DropdownMenuItem>
              <DropdownMenuItem>Certificates</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
