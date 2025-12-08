"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/student/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Edit2,
  Save,
  MapPin,
  GraduationCap,
  Building,
  User,
  Camera,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentProfileClient({ user: serverUser }) {
  const router = useRouter();
  // --- STATE MANAGEMENT ---
  const initialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(initialDetails);
  const [editedDetails, setEditedDetails] = useState(initialDetails);

  // --- DATA SYNC ---
  useEffect(() => {
    if (!serverUser) return;
    const mapped = {
      firstName: serverUser.first_name ?? serverUser.firstName ?? serverUser.username ?? "",
      lastName: serverUser.last_name ?? serverUser.lastName ?? "",
      email: serverUser.email ?? "",
      phone: serverUser.phone ?? "+91 98765 43210",
      rollNumber: serverUser.rollNumber ?? "21CS001",
      department: serverUser.department ?? "Computer Science",
      year: serverUser.year ?? "3rd Year",
      dateOfBirth: serverUser.date_of_birth ?? serverUser.dateOfBirth ?? "2003-05-15",
      address: serverUser.address ?? "123 Student Street",
      city: serverUser.city ?? "Hyderabad",
      state: serverUser.state ?? "Telangana",
      country: serverUser.country ?? "India",
      pincode: serverUser.pincode ?? "500001",
    };
    setPersonalDetails(mapped);
    setEditedDetails(mapped);
  }, [serverUser]);

  // --- HANDLERS ---
  const onEdit = () => {
    setEditedDetails(personalDetails);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPersonalDetails((prev) => ({ ...prev, ...editedDetails }));
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedDetails(personalDetails);
    setIsEditing(false);
  };

  if (!serverUser)
    return <div className="p-8 text-center">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-background pb-10">
      <DashboardHeader user={serverUser} />

      <main className="container mx-auto px-4 max-w-6xl mt-6">
        <Button
          onClick={() => router.back()}
          variant="ghost" 
          className="mb-4 pl-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        {/* Success Toast / Alert */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* --- LEFT COLUMN (Main Profile) --- */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card with Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-border/50 shadow-sm">
                <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                  {/* Edit Cover Button (Visual only) */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
                  >
                    <Camera className="h-4 w-4 mr-2" /> Change Cover
                  </Button>
                </div>
                <CardContent className="relative pt-0 pb-6 px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-2xl bg-slate-200 text-slate-600">
                        {personalDetails.firstName[0]}
                        {personalDetails.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 mt-2 sm:mt-0">
                      <h1 className="text-3xl font-bold">
                        {personalDetails.firstName} {personalDetails.lastName}
                      </h1>
                      <div className="flex flex-wrap gap-2 text-base text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />{" "}
                          {personalDetails.department}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />{" "}
                          {personalDetails.year} Student
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                      {!isEditing ? (
                        <Button
                          onClick={onEdit}
                          className="w-full sm:w-auto gap-2"
                          variant="outline"
                        >
                          <Edit2 className="h-4 w-4" /> Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none gap-2"
                          >
                            {isSaving ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Save
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="ghost"
                            className="flex-1 sm:flex-none"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Manage your personal and academic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Info Group */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <User className="h-5 w-5" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          name="firstName"
                          value={editedDetails.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={
                            !isEditing
                              ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                              : ""
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          name="lastName"
                          value={editedDetails.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={
                            !isEditing
                              ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                              : ""
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Input
                            name="email"
                            value={editedDetails.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium pl-6"
                                : "pl-9"
                            }
                          />
                          <Mail
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                              !isEditing ? "left-0" : "left-3"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="relative">
                          <Input
                            name="phone"
                            value={editedDetails.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium pl-6"
                                : "pl-9"
                            }
                          />
                          <Phone
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                              !isEditing ? "left-0" : "left-3"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <div className="relative">
                          <Input
                            type={isEditing ? "date" : "text"}
                            name="dateOfBirth"
                            value={editedDetails.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium pl-6"
                                : "pl-9"
                            }
                          />
                          <Calendar
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                              !isEditing ? "left-0" : "left-3"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Academic Info Group */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" /> Academic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-lg border border-border/50">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">
                          Roll Number
                        </Label>
                        <div className="font-mono font-medium">
                          {personalDetails.rollNumber}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">
                          Department
                        </Label>
                        <div className="font-medium">
                          {personalDetails.department}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">
                          Current Year
                        </Label>
                        <div className="font-medium">
                          {personalDetails.year}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Address Info Group */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Location
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label>Address Line</Label>
                        <Input
                          name="address"
                          value={editedDetails.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={
                            !isEditing
                              ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                              : ""
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            name="city"
                            value={editedDetails.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                                : ""
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            name="state"
                            value={editedDetails.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                                : ""
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Input
                            name="country"
                            value={editedDetails.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                                : ""
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pincode</Label>
                          <Input
                            name="pincode"
                            value={editedDetails.pincode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={
                              !isEditing
                                ? "bg-transparent border-transparent px-0 shadow-none h-auto font-medium"
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN (Activity Widget) --- */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-border/50 shadow-sm">
                <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pb-8">
                  <CardTitle className="text-xl">Activity Score</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    Your engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative -mt-6">
                  {/* Floating Stats Card */}
                  <div className="bg-background rounded-xl shadow-lg border p-6 flex flex-col items-center justify-center mb-6">
                    <div className="relative w-32 h-32 mb-2">
                      <svg
                        className="transform -rotate-90 w-32 h-32"
                        viewBox="0 0 120 120"
                      >
                        {/* Defs for Gradient */}
                        <defs>
                          <linearGradient
                            id="scoreGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-slate-100 dark:text-slate-800"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 1000" }}
                          animate={{
                            strokeDasharray: `${
                              (85 / 100) * 2 * Math.PI * 54
                            } ${2 * Math.PI * 54}`,
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">
                          85
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Top 15% in Class
                    </Badge>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-5">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Breakdown
                    </h4>
                    {[
                      {
                        label: "Certificates",
                        current: 28,
                        total: 30,
                        color: "bg-green-500",
                      },
                      {
                        label: "Internships",
                        current: 22,
                        total: 25,
                        color: "bg-blue-500",
                      },
                      {
                        label: "Events",
                        current: 18,
                        total: 20,
                        color: "bg-purple-500",
                      },
                      {
                        label: "Projects",
                        current: 17,
                        total: 25,
                        color: "bg-orange-500",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground text-xs">
                            {item.current}/{item.total}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(item.current / item.total) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
