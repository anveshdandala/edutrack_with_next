// app/globalLogin/page.jsx
import GlobalLoginClient from "@/components/common/GlobalLoginClient";
import { fetchInstitutions } from "@/lib/publicApi";

export default async function GlobalLoginPage() {
  let colleges = [];
  try {
    colleges = await fetchInstitutions();
    // [{id: '' ,name: '',schema_name: 'vmeg',domain: 'vmeg'},]
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
