"use client";

import { useState } from "react";
import EditPanel from "./EditPanel";

export default function HighlightableField({
  value,
  onChange,
  fieldPath,
  className = "",
  accentColor = "#3b82f6",
  children,
}) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
    });
    setIsHighlighted(true);
  };

  const handleBlur = () => {
    setIsHighlighted(false);
  };

  return (
    <>
      <div
        onDoubleClick={handleDoubleClick}
        className={`
          relative cursor-text transition-all
          ${isHighlighted ? "rounded-md" : ""}
          ${className}
        `}
        style={
          isHighlighted
            ? {
                outline: `2px solid ${accentColor}`,
                outlineOffset: "4px",
                backgroundColor: `${accentColor}20`,
              }
            : {}
        }
      >
        {children}
      </div>

      {isHighlighted && (
        <EditPanel
          value={value}
          onChange={onChange}
          position={position}
          onClose={handleBlur}
          accentColor={accentColor}
        />
      )}
    </>
  );
}
