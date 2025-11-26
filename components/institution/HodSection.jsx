"use client";
import { useState } from "react";
import HodForm from "./HodForm";

export default function HodSection() {
  const [hodExists, setHodExists] = useState(false);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-3">Add HOD</h3>

      {hodExists ? (
        <p>HOD already exists</p>
      ) : (
        <HodForm onCreated={() => setHodExists(true)} />
      )}
    </div>
  );
}
