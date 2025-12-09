"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, TrendingUp, PieChart } from "lucide-react";

// Professional Color Palette
const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-red-500', 'bg-indigo-500'];

export default function InsightsClient({ students }) {
  
  // --- Data Processing ---
  const stats = useMemo(() => {
    // Ensure strict array type to prevent serialization crashes
    const safeStudents = Array.isArray(students) ? students : [];

    // A. Count by Department
    const deptMap = {};
    safeStudents.forEach(s => {
      const deptName = s.department === 0 ? "General (Year 1)" : s.department || "Unknown";
      deptMap[deptName] = (deptMap[deptName] || 0) + 1;
    });
    
    const deptData = Object.keys(deptMap).map((key, index) => ({
      name: key,
      value: deptMap[key],
      percentage: safeStudents.length > 0 ? ((deptMap[key] / safeStudents.length) * 100).toFixed(1) : 0,
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value); 

    // B. Count by Batch Year
    const batchMap = {};
    safeStudents.forEach(s => {
      const batch = s.batch_year || "Unknown";
      batchMap[batch] = (batchMap[batch] || 0) + 1;
    });

    const batchData = Object.keys(batchMap).map(key => ({
      name: key.toString(),
      value: batchMap[key]
    })).sort((a, b) => a.name.localeCompare(b.name));

    const maxBatchValue = Math.max(...batchData.map(d => d.value), 1);

    return { deptData, batchData, maxBatchValue, total: safeStudents.length };
  }, [students]);

  // --- Render ---
  return (
    <div className="space-y-6">
      
      {/* Top Stats Cards (Inlined to avoid passing Icon functions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{stats.total}</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
               <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">
                 Active Directory
               </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Batches */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Batches</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{stats.batchData.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
               <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">
                 Enrolled Years
               </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Departments */}
        <Card className="border-l-4 border-l-violet-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Departments</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900">{stats.deptData.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-violet-50">
                <BookOpen className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
               <span className="font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">
                 Across Institution
               </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CSS BAR CHART: Batch Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              Enrollment by Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-4 px-4 border-b border-gray-200 pb-2">
               {stats.batchData.length === 0 ? (
                 <p className="w-full text-center text-gray-400 text-sm">No data available</p>
               ) : (
                 stats.batchData.map((batch, idx) => {
                   const heightPercent = stats.maxBatchValue > 0 
                      ? (batch.value / stats.maxBatchValue) * 100 
                      : 0;
                   return (
                     <div key={idx} className="flex flex-col items-center justify-end h-full w-full group">
                       <div className="relative w-full max-w-[60px] h-full flex items-end">
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                             {batch.value} Students
                          </div>
                          <div 
                            className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-500 ease-out"
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                       </div>
                       <p className="mt-2 text-xs font-medium text-gray-500">{batch.name}</p>
                     </div>
                   )
                 })
               )}
            </div>
          </CardContent>
        </Card>

        {/* CSS LIST CHART: Department Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-500" />
              Department Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[340px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-5">
              {stats.deptData.length === 0 ? (
                 <p className="text-center text-gray-400 text-sm mt-10">No department data available</p>
              ) : (
                stats.deptData.map((dept, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[70%]">
                        {dept.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {dept.value} <span className="font-normal text-gray-400">({dept.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${dept.color} transition-all duration-1000 ease-out`} 
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}