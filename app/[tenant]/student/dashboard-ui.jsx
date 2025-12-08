"use client";

import { useRouter, useParams } from "next/navigation";
import {
    Edit, Activity, Briefcase, ChevronRight, FileText, Sparkles,
    Award, Zap, Calendar, BarChart3, TrendingUp
} from "lucide-react";
import { DashboardHeader } from "@/components/student/dashboard-header";
import StudentChatWidget from "@/components/student/StudentChatWidget";
import { MOCK_STUDENT_PROFILE } from "@/components/student/constants";
import { useEffect } from "react";

export default function StudentDashboardUI({ user }) {
    const router = useRouter();
    const params = useParams();
    const tenant = params.tenant;

    useEffect((data) => {
        console.log("[dashboard] data", data);
    })

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

    const stats = [
        { label: 'GPA', value: 8.7, max: 10, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', suffix: '/10' },
        { label: 'Projects', value: 5, max: 8, color: 'from-indigo-500 to-blue-500', bg: 'bg-blue-50', suffix: '' },
        { label: 'Certificates', value: 6, max: 10, color: 'from-indigo-500 to-blue-500', bg: 'bg-emerald-50', suffix: '' },
        { label: 'Events', value: 12, max: 15, color: 'from-indigo-500 to-blue-500', bg: 'bg-purple-50', suffix: '' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 h-screen overflow-hidden">
            <DashboardHeader user={user} />

            {/* Main Layout - Grid on Desktop, Stack on Mobile */}
            <div className="flex-1 overflow-hidden lg:grid lg:grid-cols-12 relative">

                {/* Left Column (1/3 width) - Fixed Height on Desktop */}
                <aside className="lg:col-span-3 h-full overflow-y-auto border-r border-gray-200 bg-white p-6 flex flex-col gap-6 custom-scrollbar z-10">

                    {/* 1. Profile Card */}
                    <div
                        onClick={() => onNavigate('edit-profile')}
                        className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <div className="relative mt-8 mb-4">
                            <div className="w-24 h-24 bg-white p-1 rounded-full mx-auto shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                                    {userInitials}
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                        <p className="text-base text-gray-500 mb-6">Computer Science • Sem 4</p>

                        <div className="grid grid-cols-2 gap-4 text-left text-base mb-6 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <span className="block text-xs text-gray-400 font-bold uppercase">ID Number</span>
                                <span className="font-bold text-gray-700">23881A66F5</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 font-bold uppercase mb-1">CGPA</span>
                                <span className="font-bold text-gray-700">8.7 / 10</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Email</span>
                                <span className="font-medium text-gray-700 truncate block">{userEmail}</span>
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
                            <span className="text-5xl font-black text-gray-900">850</span>
                            <span className="text-lg font-bold text-gray-400 mb-2">XP</span>
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
                <main className="lg:col-span-9 h-full bg-[#f8f9fa] overflow-y-auto relative custom-scrollbar">
                    <div className="p-6 md:p-8 space-y-8 pb-32">
                        {/* 1. Performance Analytics Graph */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                                {/* Chart Section */}
                                <div className="xl:col-span-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <BarChart3 className="text-blue-600" size={20} />
                                                Performance Overview
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">Academic and extracurricular metrics analysis</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                            <TrendingUp size={14} className="text-blue-500" />
                                            <span>+12% vs last sem</span>
                                        </div>
                                    </div>

                                    {/* Bar Chart Container */}
                                    <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
                                        {stats.map((stat, idx) => {
                                            const percentage = (stat.value / stat.max) * 100;
                                            return (
                                                <div key={idx} className="flex flex-col items-center justify-end h-full w-full group cursor-pointer">
                                                    {/* Floating Tooltip */}
                                                    <div className="mb-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                                                        <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-xl">
                                                            {stat.value}
                                                        </span>
                                                    </div>

                                                    {/* Bar Track */}
                                                    <div className={`w-full max-w-[56px] bg-gray-100 rounded-t-xl relative h-full flex items-end overflow-hidden ${stat.bg}`}>
                                                        {/* Filled Bar */}
                                                        <div
                                                            className={`w-full rounded-t-xl transition-all duration-1000 ease-out bg-gradient-to-t ${stat.color} opacity-90 group-hover:opacity-100`}
                                                            style={{ height: `${percentage}%` }}
                                                        ></div>
                                                    </div>

                                                    {/* Label */}
                                                    <div className="mt-4 text-center">
                                                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">{stat.label}</p>
                                                        <p className="text-xs text-gray-400 font-medium group-hover:text-blue-600 transition-colors">
                                                            {stat.value}{stat.suffix}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Insights Section - Visible only on large screens */}
                                <div className="hidden xl:flex xl:col-span-4 xl:border-l xl:border-gray-100 xl:pl-8 flex-col justify-between py-2">
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Sparkles size={18} className="text-yellow-500" /> Key Highlights
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-sm text-blue-600 font-bold mb-1">Top Performer</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Maintained <span className="font-bold text-gray-900">90% attendance</span> in all core subjects this semester.
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                                                <p className="text-sm text-green-600 font-bold mb-1">Skill Growth</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Acquired <span className="font-bold text-gray-900">2 new certificates</span> in Web Development.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <span>Semester Goal</span>
                                            <span className="font-bold text-gray-900">85%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 1. Certificates Block (Horizontal Scroll) */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Award className="text-blue-600" size={20} /> Certificates
                                </h3>
                                <button
                                    onClick={() => onNavigate('certificates')}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {/* Card 1 */}
                                <div className="min-w-[320px] bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                            <Zap size={20} fill="currentColor" />
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">VERIFIED</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Python Professional</h4>
                                    <p className="text-sm text-gray-500 mb-3">HackerRank • Issued Feb 2024</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                        <div className="w-full h-full bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="min-w-[320px] bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                            <Zap size={20} />
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">VERIFIED</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Django Web Dev</h4>
                                    <p className="text-sm text-gray-500 mb-3">Udemy • Issued Jan 2024</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                        <div className="w-full h-full bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="min-w-[320px] bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0 opacity-80">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                            <Activity size={20} />
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">PENDING</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Tech Symposium</h4>
                                    <p className="text-sm text-gray-500 mb-3">College Event • Mar 2024</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                        <div className="w-[60%] h-full bg-blue-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Internships Block */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Briefcase className="text-blue-600" size={20} /> Internships
                            </h3>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center">
                                            <div className="w-7 h-7 rounded-full bg-blue-500"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">Data Science Intern</h4>
                                            <p className="text-sm text-gray-500">Spotify • New York (Remote)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">Python</span>
                                            <span className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">ML</span>
                                        </div>
                                        <button className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            T
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">Backend Developer</h4>
                                            <p className="text-sm text-gray-500">TechCorp • Hyderabad</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">Django</span>
                                        </div>
                                        <button className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

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
            <StudentChatWidget tenant={tenant} />
        </div>
    );
}
