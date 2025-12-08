import JobInputForm from "@/components/resume/JobInputForm";

export default async function ResumePage({ params }) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <JobInputForm tenant={tenant} />
    </div>
  );
}