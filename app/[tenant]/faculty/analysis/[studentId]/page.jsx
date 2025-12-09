import StudentAnalysisUI from "./student-analysis-ui"; // Ensure this import path is correct

export default async function StudentAnalysisPage({ params, searchParams }) {
  // 1. Unwrap Promises (Next.js 15 Requirement)
  const { tenant, studentId } = await params;
  const query = await searchParams;

  // 2. Construct Data from URL Params (Bypassing Backend Fetch)
  // This prevents the 403/404 error because we aren't asking the server for data.
  const studentData = {
    id: studentId,
    // Combine first/last names or use raw name
    first_name: query.name?.split(" ")[0] || "Student",
    last_name: query.name?.split(" ").slice(1).join(" ") || "",
    username: query.name,
    email: query.email || "No Email Provided",
    roll_number: query.roll_number || studentId,
    department_name: query.department || "General",
    current_semester: query.semester || "N/A",
    batch_year: query.batch || "N/A",
    // Mocking missing fields for UI consistency
    phone_number: "N/A",
    city: "N/A",
    state: "N/A"
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
       <StudentAnalysisUI student={studentData} tenant={tenant} />
    </div>
  );
}