// app/[tenant]/auth/login/page.jsx   (server component)
import LoginPage from "@/components/common/LoginPage"; // your client component file path
import { fetchInstitutions } from "@/lib/publicApi";

export default async function TenantLoginPage({ params }) {
  const resolved = await params;
  const tenant = resolved?.tenant;
  console.log("tenant", tenant);

  let meta = null;
  try {
    const list = await fetchInstitutions();
    meta = list.find((c) => c.schema_name === tenant) ?? null;
  } catch (err) {
    console.error("fetchInstitutions error:", err);
  }

  if (!meta) {
    return (
      <div className="p-10">
        <h2>Unknown tenant: {String(tenant)}</h2>
        <a href="/globalLogin">Back to select college</a>
      </div>
    );
  }

  // Render client LoginPage and pass tenant meta (logo, name, domain, etc.)
  return <LoginPage tenantMeta={meta} />;
}
