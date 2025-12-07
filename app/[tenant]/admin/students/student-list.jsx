import { serverFetch } from "@/lib/server-api";
import StudentClient from "./student-client";

export default async function StudentList({ tenant }) {
  let students = [];

  try {
    // This is the "Blocking" part.
    // Because it is wrapped in Suspense in the parent,
    // it won't block the whole page navigation anymore.
    const data = await serverFetch("/administration/academics-students", {
      tenant,
    });

    students = Array.isArray(data) ? data : data?.results || [];
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }

  return <StudentClient initialStudents={students} />;
}
