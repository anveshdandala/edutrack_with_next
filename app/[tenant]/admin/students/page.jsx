// D:\nah\SIH\newshi\app\[tenant]\admin\students\page.jsx
import { serverFetch } from "@/lib/server-api";
import StudentClient from "./student-client";

export const dynamic = "force-dynamic";

export default async function StudentsPage({ params }) {
  const { tenant } = await params;
  let students = [];
  try {
    const data = await serverFetch("/administration/academics-students", {
      tenant,
    });
    students = Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }

  return (
    <div className="container mx-auto px-6 py-8 h-screen flex flex-col">
      <StudentClient initialStudents={students} />
    </div>
  );
}
