import StudentAnalysisUI from "./student-analysis-ui";

// Note: We don't need 'async' for the component if we aren't fetching, 
// but searchParams is async in Next.js 15, so we keep it async.
export default async function StudentAnalysisPage({ params, searchParams }) {
  // 1. Unwrap Params
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams; // In Next.js 15 searchParams is a promise
  
  const { tenant, studentId } = resolvedParams;

  // 2. Construct Student Object from URL Query
  // This bypasses the need for a backend fetch
  const studentData = {
    id: studentId,
    first_name: resolvedSearchParams.name?.split(" ")[0] || "Student",
    last_name: resolvedSearchParams.name?.split(" ").slice(1).join(" ") || "",
    username: resolvedSearchParams.name,
    email: resolvedSearchParams.email || "No Email",
    roll_number: resolvedSearchParams.roll_number || "N/A",
    department_name: resolvedSearchParams.department || "General",
    current_semester: resolvedSearchParams.semester || "N/A",
    batch_year: resolvedSearchParams.batch || "N/A",
    // Mock location/phone since we didn't have them in the list
    city: "College Campus",
    state: "India",
    phone_number: "+91 98765 43210"
  };

  // 3. Render UI with constructed data
  return (
    <div className="min-h-screen bg-gray-50/50">
       <StudentAnalysisUI student={studentData} tenant={tenant} />
    </div>
  );
}