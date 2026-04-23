// app/globalLogin/page.jsx
import GlobalLoginClient from "@/components/common/GlobalLoginClient";
import { fetchInstitutions } from "@/lib/publicApi";
import { serverFetch } from "@/lib/server-api";
export default async function GlobalLoginPage() {
  let colleges = [];
  try {
    const colleges = await serverFetch("/public/institution/");
    console.log("Fetched institutions:", colleges);
    const collegeList = colleges || [];
  } catch (e) {
    console.error("fetchInstitutions failed:", e);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold">Select Your College</h1>
      <GlobalLoginClient colleges={colleges || []} />
    </div>
  );
}
