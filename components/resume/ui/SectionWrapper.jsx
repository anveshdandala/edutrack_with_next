import React, { useState } from "react";
import { Plus, Trash2, EyeOff } from "lucide-react";

const SectionWrapper = ({
  title,
  children,
  onAdd,
  onHide,
  className = "",
  titleClassName = "",
  style,
  color,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group border border-transparent hover:border-dashed hover:border-gray-300 rounded-lg transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      {/* Floating Controls */}
      {isHovered && (
        <div className="absolute -top-3 right-0 flex gap-1 z-20 print:hidden bg-white shadow-sm rounded-md border border-gray-200 p-1">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="p-1 hover:bg-green-50 text-green-600 rounded"
              title="Add Item"
            >
              <Plus size={14} />
            </button>
          )}
          {onHide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHide();
              }}
              className="p-1 hover:bg-red-50 text-red-600 rounded"
              title="Hide Section"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {title && (
        <h3
          className={`uppercase font-bold text-sm mb-3 pb-1 border-b ${titleClassName}`}
          style={{ borderColor: color || "#e5e7eb", color: color }}
        >
          {title}
        </h3>
      )}

      {children}
    </div>
  );
};

export const SectionItemWrapper = ({ children, onDelete, className = "" }) => {
  return (
    <div className={`relative group/item ${className}`}>
      <div className="absolute -right-2 top-0 opacity-0 group-hover/item:opacity-100 transition-opacity z-10 print:hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm"
          title="Remove Item"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {children}
    </div>
  );
};

export default SectionWrapper;
