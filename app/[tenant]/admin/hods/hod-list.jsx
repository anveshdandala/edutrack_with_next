import { serverFetch } from "@/lib/server-api";

export default async function HodsList({ tenant }) {
  let hods = [];
  let hasError = false; // Add a flag

  try {
    const data = await serverFetch("/administration/list-hods/", {
      tenant,
      cache: "no-store",
    });

    if (data === null) {
      hasError = true; // Mark as error
    } else {
      hods = Array.isArray(data) ? data : data?.results || [];
    }
  } catch (e) {
    console.error("Failed to get HODS:", e);
    hasError = true;
  }

  // 1. Handle Error State Explicitly
  if (hasError) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-lg border border-red-200 border-dashed">
        <p className="text-red-600 font-medium">
          System Error: Unable to load HODs.
        </p>
        <p className="text-xs text-red-500 mt-1">
            Check server logs for [Fetch Error]
        </p>
      </div>
    );
  }

  // 2. Handle Empty State
  if (hods.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">
          No HODs found in database.
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
