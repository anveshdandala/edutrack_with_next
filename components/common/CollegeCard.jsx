"use client";
import React from "react";

export default function CollegeCard({ college, onSelect }) {
  return (
    <button
      type="button"
      className="p-4 border rounded hover:bg-gray-100 text-left"
      onClick={() => onSelect(college)}
    >
      <div className="font-bold">{college.name}</div>
      <div className="text-sm text-gray-500">{college.domain}</div>
    </button>
  );
}
