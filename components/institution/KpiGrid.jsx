"use client";

export default function KpiGrid({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((kpi, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded shadow flex justify-between"
        >
          <div>
            <p className="text-sm text-gray-500">{kpi.title}</p>
            <p className="text-xl font-bold">{kpi.value}</p>
          </div>
          <div>{<kpi.icon className="w-6 h-6 text-blue-600" />}</div>
        </div>
      ))}
    </div>
  );
}
