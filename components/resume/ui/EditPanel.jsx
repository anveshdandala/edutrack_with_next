"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function EditPanel({
  value,
  onChange,
  position,
  onClose,
  accentColor = "#3b82f6",
}) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (onChange) {
      const fakeEvent = {
        target: { value: editValue },
      };
      onChange(fakeEvent);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSave();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed z-50 bg-card border rounded-lg shadow-lg p-3 flex items-center gap-2"
      style={{
        top: `${position.y - 60}px`,
        left: `${position.x}px`,
        minWidth: `${position.width}px`,
        borderColor: accentColor,
        borderWidth: "2px",
      }}
    >
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Edit text..."
        className="bg-background text-foreground px-3 py-2 rounded border border-border focus:outline-none flex-1 text-sm"
        style={{ outlineColor: accentColor }}
        autoFocus
      />
      <button
        onClick={handleSave}
        className="p-1.5 hover:bg-secondary rounded transition-colors"
        title="Save (Enter)"
      >
        <Check size={16} className="text-green-600" />
      </button>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-secondary rounded transition-colors"
        title="Cancel (Esc)"
      >
        <X size={16} />
      </button>
    </div>
  );
}
