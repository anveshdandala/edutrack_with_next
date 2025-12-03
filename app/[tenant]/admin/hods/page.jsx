import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { error } from "console";

export default async function HodsListPage({ params }) {
  const { tenant } = await params;
  let hods = [];
  try {
    const data = await serverFetch("/administration/list-hods", {
      tenant,
      caches: "no-store",
    });
    hods = data;
  } catch (e) {
    console.error("failed to get HODS");
  }
  console.log(hods);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HOD Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage department heads
          </p>
        </div>
        {/* Corrected Link */}
        <Link href={`/${tenant}/admin/hods/create`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create HOD
          </Button>
        </Link>
      </div>

      {/* Placeholder for HOD list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hods.map((hod) => (
          <div
            key={`${hod.employee_id}`}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col gap-3">
              <div className="border-b border-border pb-3">
                <p className="text-sm text-muted-foreground font-medium">
                  {hod.department}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {hod.full_name}
                </p>
                <p className="text-sm text-foreground">{hod.email}</p>
              </div>
              <button className="mt-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm">
                Manage HOD
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
