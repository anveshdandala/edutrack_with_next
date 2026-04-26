import { headers } from "next/headers";
import { fetchServer } from "@/lib/server-api";
import StudentClient from "@/components/institution/studentDash";

export default async function StudentsPage() {
  const headersList = await headers();
  const tenant = headersList.get("x-tenant");
  let students = [];

  try {
    const data = await fetchServer("/profiles/students/", { tenant });
    console.log(data);
    students = Array.isArray(data)
      ? data
      : data?.results || (data ? [data] : []);
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }

  return (
    <div className="container mx-auto px-6 py-8 h-screen flex flex-col">
      <StudentClient initialStudents={students} />
    </div>
  );
}
