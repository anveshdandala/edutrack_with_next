"use client";

export default function RecentActivity({ items }) {
  return (
    <div className="p-4 bg-white rounded shadow space-y-3">
      {items.map((it, i) => (
        <div key={i} className="p-3 border rounded bg-gray-50">
          <p className="font-medium">
            {it.student} ({it.department})
          </p>
          <p className="text-sm">{it.achievement}</p>
          <p className="text-xs text-gray-500">Verified by {it.verifier}</p>
        </div>
      ))}
    </div>
  );
}
