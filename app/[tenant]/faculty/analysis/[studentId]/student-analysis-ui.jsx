"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin, BookOpen } from "lucide-react";

export default function StudentAnalysisUI({ student, tenant }) {
  
  const fullName = student.first_name 
    ? `${student.first_name} ${student.last_name}` 
    : student.username;
    
  const initials = fullName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar showAuthButtons={false} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${tenant}/faculty`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden border-t-4 border-t-blue-600 shadow-sm">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-blue-50">
                  <AvatarFallback className="text-blue-700 text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                     Active Student
                   </span>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {student.department_name} • Sem {student.current_semester}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Roll Number</p>
                      <p className="font-mono text-sm">{student.roll_number}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Batch Year</p>
                      <p className="font-mono text-sm">{student.batch_year}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                      <div className="flex items-center gap-2 text-sm">
                         <Mail className="w-3 h-3 text-blue-500" /> {student.email}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Contact</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Phone className="w-3 h-3 text-green-600" /> {student.phone_number}
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}