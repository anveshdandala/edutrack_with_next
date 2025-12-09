import { serverFetch } from "@/lib/server-api";
import StudentClient from "./student-client";

export default async function StudentList({ tenant }) {
  let students = [];
  let errorMessage = null;

  try {
    // Note: Added trailing slash just in case Django requires it
    const data = await serverFetch("/administration/academics-students/", {
      tenant,
      cache: "no-store",
    });

    if (data === null) {
        throw new Error("Could not fetch data.");
    }

    students = Array.isArray(data) ? data : data?.results || [];
  } catch (error) {
    console.error("Failed to fetch students:", error);
    errorMessage = "Failed to load student records. Please verify your connection or permissions.";
  }

  return <StudentClient initialStudents={students} initialError={errorMessage} />;
}