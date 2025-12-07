import { serverFetch } from "@/lib/server-api";

export default async function HodsList({ tenant }) {
  let hods = [];
  try {
    const data = await serverFetch("/administration/list-hods", {
      tenant,
      cache: "no-store",
    });

    // FIX: Use data?.results instead of data.results
    // If data is null, this evaluates to undefined || [], which is []
    hods = Array.isArray(data) ? data : data?.results || [];
  } catch (e) {
    console.error("Failed to get HODS:", e);
  }

  // Handle empty state gracefully
  if (hods.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">
          No HODs found or failed to load.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hods.map((hod) => (
        <div
          key={hod.employee_id || hod.id}
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {hod.department || "No Dept"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {hod.full_name || "Unknown Name"}
              </p>
              <p className="text-sm text-muted-foreground">{hod.email}</p>
            </div>
            <button className="mt-2 w-full px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors font-medium text-sm">
              Manage HOD
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
