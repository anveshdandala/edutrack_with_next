"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const navItems = [
    { name: "Dashboard", href: "/institution" },
    { name: "Departments", href: "/institution/departments" },
    { name: "HOD Management", href: "/institution/hods" },
    { name: "Students", href: "/institution/students" },
    { name: "Insights", href: "/institution/insights" },
  ];

  return (
    <div className="flex h-screen flex-col">
      <nav className="bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="w-10" /> {/* Spacer for layout balance */}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } border-r bg-white/80 backdrop-blur transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
