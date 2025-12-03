// components/institution/Sidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation"; // 1. Import useParams
import { Menu, X } from "lucide-react";

export default function Sidebar({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const params = useParams();
  const tenant = params?.tenant;

  const isActive = (path) => pathname === path;

  const navItems = [
    { name: "Dashboard", href: `/${tenant}/admin` },
    { name: "Departments", href: `/${tenant}/admin/departments` },
    { name: "HOD Management", href: `/${tenant}/admin/hods` },
    { name: "Students", href: `/${tenant}/admin/students` },
    { name: "Insights", href: `/${tenant}/admin/insights` },
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

        {/* Optional: Show User Name */}
        <div className="text-sm font-medium text-gray-600">
          {user?.username || "Admin"}
        </div>
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
