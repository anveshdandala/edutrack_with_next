// D:\nah\SIH\newshi\app\[tenant]\student\dashboard-ui.jsx
"use client";
import StudentAnalytics from "@/components/student/dashboard/StudentAnalytics";
import { useRouter, useParams } from "next/navigation";
import {    
    Edit, Activity, Briefcase, ChevronRight, FileText, Sparkles,
    Award, Zap, Calendar, BarChart3, TrendingUp, PieChart as PieChartIcon
} from "lucide-react";
import { DashboardHeader } from "@/components/student/dashboard-header";
import StudentChatWidget from "@/components/student/StudentChatWidget";
import { MOCK_STUDENT_PROFILE } from "@/components/student/constants";
import { useEffect } from "react";




export default function StudentDashboardUI({ user, certificatesSlot, internshipsSlot }) {
    const router = useRouter();
    const params = useParams();
    const tenant = params.tenant;

    const userName = user?.username || "Alex Chen";
    const userEmail = user?.email || "alex.chen@student.edu";
    const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const onNavigate = (path) => {
        // Handle path mapping
        if (path === 'portfolio') router.push(`/${tenant}/student/portfolio/professional-portfolio`);
        if (path === 'resume') router.push(`/${tenant}/student/resume`);
        if (path === 'edit-profile') router.push(`/${tenant}/student/profile`);
        if (path === 'certificates') router.push(`/${tenant}/student/certificates`);
    };



    return (
        <div className="min-h-screen flex flex-col bg-gray-50 h-screen overflow-hidden">
            <DashboardHeader user={user} />

            {/* Main Layout - Grid on Desktop, Stack on Mobile */}
            <div className="flex-1 overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl lg:grid lg:grid-cols-12 relative">

                {/* Left Column (1/3 width) - Fixed Height on Desktop */}
                <aside className="lg:col-span-3 h-full overflow-y-auto border-r border-gray-200 bg-white p-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] z-10">

                    {/* 1. Profile Card */}
                    <div
                        onClick={() => onNavigate('edit-profile')}
                        className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <div className="relative mt-6 mb-3">
                            <div className="w-20 h-20 bg-white p-1 rounded-full mx-auto shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xl font-bold">
                                    {userInitials}
                                </div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {user?.department || "Computer Science"} • Sem {user?.current_semester || "4"}
                        </p>

                        <div className="flex flex-col gap-2 text-left text-sm mb-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">ID Number</span>
                                <span className="font-bold text-gray-700 text-xs">{user?.roll_number || "23881A66F5"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                                <span className="text-[10px] text-gray-500 font-bold uppercase">CGPA</span>
                                <span className="font-bold text-gray-700 text-xs">{user?.cgpa || "8.7"} / 10</span>
                            </div>
                            <div className="pt-0.5">
                                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Email</span>
                                <span className="font-medium text-gray-700 truncate block text-xs" title={userEmail}>{userEmail}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Activity Score */}
                    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wide">
                                <Activity size={18} />
                                <span>Activity Score</span>
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">TOP 15%</span>
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-black text-gray-900">90</span>
                            <span className="text-lg font-bold text-gray-400 mb-2">/100</span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[85%]"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-default">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Internship
                                </span>
                                <span className="font-bold text-gray-900">+200 XP</span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-default">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Symposium
                                </span>
                                <span className="font-bold text-gray-900 text-blue-500">Pending</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Quick Actions */}
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => onNavigate('portfolio')}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Briefcase size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Career Portfolio</p>
                                    <p className="text-xs text-blue-100">View & Generate</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-white/70" />
                        </button>

                        <button
                            onClick={() => onNavigate('resume')}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <FileText size={22} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-base text-gray-900">Build Resume</p>
                                    <p className="text-sm text-gray-500">ATS-Friendly Templates</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
                        </button>

                        <button className="flex items-center justify-between p-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <Sparkles size={22} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-base text-gray-900">Talent Insights</p>
                                    <p className="text-sm text-gray-500">Skills & Hidden Talents</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-500" />
                        </button>
                    </div>
                </aside>

                {/* Right Column (2/3 width) - Scrollable */}
                {/* Right Column (2/3 width) - Scrollable */}
                <main className="lg:col-span-9 h-full bg-[#f8f9fa] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="p-6 md:p-8 space-y-8 pb-32">

                        {/* 1. Combined Performance & Analytics Section */}
                        <div className="mb-8">
                           <StudentAnalytics tenant={tenant} />
                        </div>


                        {/* 1. Certificates Block (Horizontal Scroll) */}
                        {certificatesSlot}

                        {/* 2. Internships Block */}
                        {internshipsSlot}

                        {/* 3. Events Block */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Calendar className="text-blue-600" size={20} /> Events
                            </h3>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="bg-blue-50 text-blue-600 rounded-lg w-20 h-20 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-sm font-bold uppercase">Mar</span>
                                        <span className="text-2xl font-bold">22</span>
                                    </div>
                                    <div className="flex-1 py-1">
                                        <h4 className="font-bold text-lg text-gray-900 mb-1">University Career Fair 2024</h4>
                                        <div className="flex gap-6 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">⏰ 09:00 AM</span>
                                            <span className="flex items-center gap-1.5">📍 Campus Grounds</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <ChevronRight size={22} className="text-gray-300" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-5 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="bg-purple-50 text-purple-600 rounded-lg w-20 h-20 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-sm font-bold uppercase">Apr</span>
                                        <span className="text-2xl font-bold">05</span>
                                    </div>
                                    <div className="flex-1 py-1">
                                        <h4 className="font-bold text-lg text-gray-900 mb-1">Hackathon: Code for Good</h4>
                                        <div className="flex gap-6 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">⏰ 10:00 AM</span>
                                            <span className="flex items-center gap-1.5">📍 Innovation Hub</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <ChevronRight size={22} className="text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Floating Chat Interface */}
            <StudentChatWidget user={user} tenant={tenant} />
        </div>
    );
}
