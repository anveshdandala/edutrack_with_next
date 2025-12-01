import { fetchServer } from "@/lib/server-api";
import StudentClient from "./student-client";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  // 1. Fetch data on the Server
  // This happens BEFORE the page is sent to the browser.
  let students = [];
  try {
    const data = await fetchServer("/institutions-students"); // Check your Django URL
    students = Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }

  // 2. Pass data to the Client Component
  return (
    <div className="container mx-auto px-6 py-8 h-screen flex flex-col">
      <StudentClient initialStudents={students} />
    </div>
  );
}
