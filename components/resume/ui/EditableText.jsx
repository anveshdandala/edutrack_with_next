import React, { useEffect, useRef } from "react";

const EditableText = ({
  value,
  onChange,
  className = "",
  multiline = false,
  style = {},
  placeholder = "Edit...",
}) => {
  // FIX: Removed TypeScript syntax <HTMLTextAreaElement>
  const textareaRef = useRef(null);

  // Auto-resize height for textarea
  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value, multiline]);

  const commonStyles =
    "bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-300/50 rounded-sm transition-all hover:bg-black/5 p-0.5 -m-0.5 placeholder:text-gray-300/50";

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`resize-none overflow-hidden w-full block leading-relaxed ${commonStyles} ${className}`}
        style={style}
        placeholder={placeholder}
        rows={1}
        spellCheck={false}
      />
    );
  }

  // For single line, we use a CSS grid trick to auto-size width
  // The container is an inline-grid. The span (invisible) forces the width. The input (absolute) fills it.
  return (
    <span
      className={`inline-grid items-center align-top relative ${className}`}
      style={{ ...style, width: "auto" }} // Ensure it doesn't force full width
    >
      {/* Invisible text to set the width */}
      <span className="col-start-1 row-start-1 invisible whitespace-pre px-0.5 border border-transparent pointer-events-none font-inherit text-inherit">
        {value || placeholder}
      </span>

      {/* Actual Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`col-start-1 row-start-1 w-full h-full ${commonStyles} text-inherit font-inherit px-0.5`}
        placeholder={placeholder}
        style={{ minWidth: "2ch" }}
      />
    </span>
  );
};

export default EditableText;
